export type TipoTransaccion = 'ingreso' | 'gasto';

export type Perfil = 'personal' | 'empresa';

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  monto: number;
  fecha: Date;
  descripcion: string;
  perfil: Perfil;
  urlComprobante?: string;
  categoria: string;
}