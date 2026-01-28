export interface Partner {
  activo: boolean;
  apellidos: string;
  direccion: string;
  email: string;
  fechaActualizacion: Date;
  fechaCreacion: Date;
  id: string;
  identificacion: string;
  nombres: string;
  telefono: string;
  tipoIdentificacion: IdentificationType;
}

export enum IdentificationType {
  Cedula = "CEDULA",
  Ruc = "RUC",
}

export interface PartnerRequestDTO {
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  tipoIdentificacion: string;
}
