import { Transaccion } from '../tipos';

const CLAVE_ALMACENAMIENTO = 'transacciones_financieras';

export const guardarTransacciones = (transacciones: Record<string, Transaccion[]>) => {
  try {
    const transaccionesSerializadas = Object.entries(transacciones).reduce(
      (acc, [userId, userTransactions]) => ({
        ...acc,
        [userId]: userTransactions.map(t => ({
          ...t,
          fecha: t.fecha.toISOString()
        }))
      }),
      {}
    );
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(transaccionesSerializadas));
  } catch (error) {
    console.error('Error al guardar las transacciones:', error);
  }
};

export const cargarTransacciones = (): Record<string, Transaccion[]> => {
  try {
    const almacenado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!almacenado) return {};
    
    const transaccionesAlmacenadas = JSON.parse(almacenado);
    return Object.entries(transaccionesAlmacenadas).reduce(
      (acc, [userId, userTransactions]) => ({
        ...acc,
        [userId]: (userTransactions as any[]).map(t => ({
          ...t,
          fecha: new Date(t.fecha)
        }))
      }),
      {}
    );
  } catch (error) {
    console.error('Error al cargar las transacciones:', error);
    return {};
  }
};