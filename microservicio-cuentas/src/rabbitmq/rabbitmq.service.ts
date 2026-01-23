import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { SocioValidacionResponse } from './interfaces/socio-validacion.interface';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: Awaited<ReturnType<typeof amqp.connect>>;
  private channel: Awaited<ReturnType<typeof amqp.connect>>['createChannel'] extends () => Promise<infer C> ? C : never;
  
  private exchangeName: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    this.exchangeName = this.configService.get<string>('RABBITMQ_EXCHANGE');
    await this.connect();
  }

  async onModuleDestroy() {
    await this.closeConnection();
  }

  private async connect(): Promise<void> {
    try {
      const host = this.configService.get('RABBITMQ_HOST');
      const port = this.configService.get('RABBITMQ_PORT');
      const username = this.configService.get('RABBITMQ_USER');
      const password = this.configService.get('RABBITMQ_PASSWORD');

      const uri = `amqp://${username}:${password}@${host}:${port}`;

      this.connection = await amqp.connect(uri);
      this.channel = await this.connection.createChannel();
      
      // Aseguramos que el exchange exista (igual que en Spring Boot)
      await this.channel.assertExchange(this.exchangeName, 'topic', { durable: true });
      
      this.logger.log('Conexión exitosa a RabbitMQ (Cliente RPC)');
    } catch (error) {
      this.logger.error('Error al conectar a RabbitMQ', error);
      throw error;
    }
  }

  // ==========================================
  // Lógica RPC: Enviar mensaje y esperar respuesta
  // ==========================================
  async validarSocio(identificacion: string): Promise<SocioValidacionResponse> {
    if (!this.channel) await this.connect();

    const correlationId = uuidv4();
    const routingKey = 'socio.validar'; // Debe coincidir con Spring Boot
    
    // 1. Crear una cola temporal exclusiva para recibir la respuesta
    const { queue: replyQueue } = await this.channel.assertQueue('', { 
      exclusive: true, 
      autoDelete: true 
    });

    return new Promise((resolve, reject) => {
      // Timeout de seguridad (5 segundos) por si Spring Boot no responde
      const timeout = setTimeout(() => {
        this.channel.deleteQueue(replyQueue).catch(() => {});
        reject(new Error('Timeout: El servicio de Socios no respondió a tiempo.'));
      }, 5000);

      // 2. Escuchar en la cola temporal
      this.channel.consume(replyQueue, (msg) => {
        if (msg && msg.properties.correlationId === correlationId) {
          clearTimeout(timeout);
          try {
            const content = JSON.parse(msg.content.toString());
            this.logger.debug(`Respuesta recibida de Socios: ${JSON.stringify(content)}`);
            resolve(content as SocioValidacionResponse);
          } catch (e) {
            reject(e);
          } finally {
            // Cerramos la cola temporal una vez recibida la respuesta
            this.channel.deleteQueue(replyQueue).catch(() => {});
          }
        }
      }, { noAck: true });

      // 3. Enviar el mensaje a Spring Boot
      const payload = JSON.stringify({ identificacion });
      
      this.logger.debug(`Enviando validación para: ${identificacion} a [${this.exchangeName}] -> [${routingKey}]`);

      this.channel.publish(this.exchangeName, routingKey, Buffer.from(payload), {
        replyTo: replyQueue,
        correlationId: correlationId,
        contentType: 'application/json'
      });
    });
  }

  async iniciarConsumidorRPC(
    queueName: string, 
    routingKey: string,
    callback: (data: any) => Promise<any>
  ) {
    if (!this.channel) await this.connect();

    // Asegurar cola
    await this.channel.assertQueue(queueName, { durable: true });
    await this.channel.bindQueue(queueName, this.exchangeName, routingKey);

    this.logger.log(`Escuchando peticiones RPC en: ${queueName}`);

    //Consumir mensajes
    this.channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          
          // Ejecutar la lógica de negocio (el callback)
          const response = await callback(content);

          // 3. Enviar respuesta a la cola temporal indicada en 'replyTo'
          const responseBuffer = Buffer.from(JSON.stringify(response));

          this.channel.sendToQueue(msg.properties.replyTo, responseBuffer, {
            correlationId: msg.properties.correlationId,
          });

          this.channel.ack(msg);
        } catch (error) {
          this.logger.error('Error procesando RPC:', error);
          
        }
      }
    });
  }

  private async closeConnection(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.logger.log('Conexión cerrada correctamente');
    } catch (error) {
      this.logger.error('Error al cerrar conexión', error);
    }
  }
}