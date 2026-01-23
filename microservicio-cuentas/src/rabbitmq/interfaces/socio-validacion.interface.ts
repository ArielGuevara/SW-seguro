export interface SocioValidacionRequest {
  identificacion: string;
}

export interface SocioValidacionResponse {
  existe: boolean;
  activo: boolean;
  socioId?: string;
  nombreCompleto?: string;
  mensaje: string;
}