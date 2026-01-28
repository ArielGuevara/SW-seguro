export interface Account {
  id: string;
  socioId: string;
  numeroCuenta: string;
  saldo: number;
  estado: string;
  tipoCuenta: AccountType;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export enum AccountType {
  ahorro = "AHORRO",
  corriente = "CORRIENTE",
}

export interface AccountRequestDTO {
  socioId: string;
  numeroCuenta: string;
  saldo: number;
  tipoCuenta: string;
}
