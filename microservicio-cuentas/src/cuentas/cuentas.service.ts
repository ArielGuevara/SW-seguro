import { Injectable, NotFoundException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';
import { CuentaRequestDto } from './dto/cuenta-request.dto';
import { CuentaResponseDto } from './dto/cuenta-response.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { OnModuleInit } from '@nestjs/common'

@Injectable()
export class CuentasService implements OnModuleInit {
  constructor(
    @InjectRepository(Cuenta)
    private readonly cuentaRepository: Repository<Cuenta>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit() {
    // Iniciamos el listener para cuando Spring Boot pregunte si puede eliminar un socio
    await this.rabbitMQService.iniciarConsumidorRPC(
      'q.cuentas.validacion', 
      'cuentas.validar.eliminacion',
      async (data: { socioId: string }) => {
        return this.verificarCuentasParaEliminacionSocio(data.socioId);
      }
    );
    await this.rabbitMQService.iniciarConsumidorRPC(
      'q.cuentas.prestamos',           
      'cuentas.validar.prestamo',    
      async (data: { numeroCuenta: string }) => {
        return this.validarCuentaParaPrestamo(data.numeroCuenta);
      }
    );
  }

  private async verificarCuentasParaEliminacionSocio(socioId: string) {
    console.log(`Verificando cuentas activas para socio: ${socioId}`);
    
    const count = await this.cuentaRepository.count({
      where: { 
        socioId: socioId, 
        activo: true, 
        estado: 'ACTIVA' 
      }
    });

    return {
      tieneCuentasActivas: count > 0,
      mensaje: count > 0 
        ? `El socio tiene ${count} cuentas activas.` 
        : 'El socio no tiene cuentas activas.'
    };
  }

  async crearCuenta(request: CuentaRequestDto): Promise<CuentaResponseDto> {
    console.log(`Verificando socio ${request.socioId} en microservicio de Socios...`);
    
    const validacionSocio = await this.rabbitMQService.validarSocio(request.socioId);

    // Validar si existe
    if (!validacionSocio.existe) {
      throw new NotFoundException(`El socio con ID ${request.socioId} no existe en el sistema de Socios.`);
    }

    // Validar si está activo
    if (!validacionSocio.activo) {
      throw new ConflictException(`El socio ${validacionSocio.nombreCompleto} está inactivo y no puede abrir cuentas.`);
    }

    // (Opcional) Podemos usar el nombre que nos devolvió el otro MS
    console.log(`Socio validado: ${validacionSocio.nombreCompleto}`);
    // Verificar número de cuenta único
    const cuentaExistente = await this.cuentaRepository.findOne({
      where: { numeroCuenta: request.numeroCuenta, activo: true }
    });

    if (cuentaExistente) {
      throw new ConflictException('El número de cuenta ya existe');
    }

    const cuenta = this.cuentaRepository.create({
      socioId: request.socioId,
      numeroCuenta: request.numeroCuenta,
      saldo: request.saldo,
      tipoCuenta: request.tipoCuenta,
      estado: 'ACTIVA',
      activo: true,
    });

    const cuentaGuardada = await this.cuentaRepository.save(cuenta);
    return this.mapToResponse(cuentaGuardada);
  }

  async actualizarCuenta(id: string, request: CuentaRequestDto): Promise<CuentaResponseDto> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id, activo: true }
    });
    
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    // Verificar si el nuevo número de cuenta ya existe (excluyendo la actual)
    if (request.numeroCuenta !== cuenta.numeroCuenta) {
      const cuentaConMismoNumero = await this.cuentaRepository.findOne({
        where: { numeroCuenta: request.numeroCuenta, activo: true }
      });
      
      if (cuentaConMismoNumero) {
        throw new ConflictException('El número de cuenta ya está en uso');
      }
    }

    cuenta.socioId = request.socioId;
    cuenta.numeroCuenta = request.numeroCuenta;
    cuenta.tipoCuenta = request.tipoCuenta;

    const cuentaActualizada = await this.cuentaRepository.save(cuenta);
    return this.mapToResponse(cuentaActualizada);
  }

  async obtenerCuenta(id: string): Promise<CuentaResponseDto> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id, activo: true }
    });
    
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    return this.mapToResponse(cuenta);
  }

  async obtenerCuentasPorSocio(socioId: string): Promise<CuentaResponseDto[]> {
    const cuentas = await this.cuentaRepository.find({
      where: { socioId, activo: true },
      order: { fechaCreacion: 'DESC' }
    });
    
    return cuentas.map(cuenta => this.mapToResponse(cuenta));
  }

  async obtenerTodasCuentas(): Promise<CuentaResponseDto[]> {
    const cuentas = await this.cuentaRepository.find({
      where: { activo: true, estado: 'ACTIVA' }
    });
    
    return cuentas.map(cuenta => this.mapToResponse(cuenta));
  }

  async eliminarCuenta(id: string): Promise<void> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id, activo: true }
    });
    
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    // Eliminación lógica
    cuenta.activo = false;
    cuenta.estado = 'CANCELADA';
    await this.cuentaRepository.save(cuenta);
  }

  async realizarRetiro(id: string, monto: number): Promise<CuentaResponseDto> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id, activo: true }
    });
    
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    if (cuenta.estado !== 'ACTIVA') {
      throw new ConflictException('La cuenta no está activa');
    }

    if (cuenta.saldo < monto) {
      throw new ConflictException('Saldo insuficiente');
    }

    cuenta.saldo -= monto;
    const cuentaActualizada = await this.cuentaRepository.save(cuenta);
    return this.mapToResponse(cuentaActualizada);
  }

  async realizarDeposito(id: string, monto: number): Promise<CuentaResponseDto> {
    const cuenta = await this.cuentaRepository.findOne({
      where: { id, activo: true }
    });
    
    if (!cuenta) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    if (cuenta.estado !== 'ACTIVA') {
      throw new ConflictException('La cuenta no está activa');
    }

    cuenta.saldo += monto;
    const cuentaActualizada = await this.cuentaRepository.save(cuenta);
    return this.mapToResponse(cuentaActualizada);
  }

  private async validarCuentaParaPrestamo(numeroCuenta: string) {
    console.log(`Validando cuenta destino para préstamo: ${numeroCuenta}`);

    console.log('!!! MENSAJE RECIBIDO EN NESTJS !!!'); 
    console.log('Validando cuenta destino:', numeroCuenta);
    
    const cuenta = await this.cuentaRepository.findOne({
      where: { 
        numeroCuenta: numeroCuenta, 
        activo: true,
        estado: 'ACTIVA' // Solo permitimos desembolsos a cuentas activas
      }
    });

    if (cuenta) {
      return { valida: true, mensaje: 'Cuenta apta para recibir fondos.' };
    } else {
      return { valida: false, mensaje: 'Cuenta inexistente, suspendida o cancelada.' };
    }
  }

  private mapToResponse(cuenta: Cuenta): CuentaResponseDto {
    return {
      id: cuenta.id,
      socioId: cuenta.socioId,
      numeroCuenta: cuenta.numeroCuenta,
      saldo: parseFloat(cuenta.saldo.toString()),
      estado: cuenta.estado,
      tipoCuenta: cuenta.tipoCuenta,
      fechaCreacion: cuenta.fechaCreacion,
      fechaActualizacion: cuenta.fechaActualizacion,
    };
  }
}