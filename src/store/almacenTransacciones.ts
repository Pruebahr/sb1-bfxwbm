import { create } from 'zustand';
import { Transaccion, Perfil } from '../tipos';
import { guardarTransacciones, cargarTransacciones } from '../utils/almacenamiento';
import { useAuthStore } from './authStore';

interface AlmacenTransacciones {
  transacciones: Record<string, Transaccion[]>;
  perfilActivo: Perfil;
  agregarTransaccion: (transaccion: Omit<Transaccion, 'id'>) => void;
  eliminarTransaccion: (id: string) => void;
  editarTransaccion: (id: string, datos: Partial<Transaccion>) => void;
  establecerPerfilActivo: (perfil: Perfil) => void;
  reiniciarTransacciones: () => void;
  obtenerBalance: () => number;
  obtenerTotalIngresos: () => number;
  obtenerTotalGastos: () => number;
}

export const useAlmacenTransacciones = create<AlmacenTransacciones>((set, get) => ({
  transacciones: cargarTransacciones(),
  perfilActivo: 'personal',
  
  agregarTransaccion: (transaccion) => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return;

    set((state) => {
      const userId = currentUser.username;
      const userTransactions = state.transacciones[userId] || [];
      const nuevasTransacciones = {
        ...state.transacciones,
        [userId]: [...userTransactions, { ...transaccion, id: crypto.randomUUID() }]
      };
      guardarTransacciones(nuevasTransacciones);
      return { transacciones: nuevasTransacciones };
    });
  },

  eliminarTransaccion: (id) => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return;

    set((state) => {
      const userId = currentUser.username;
      const userTransactions = state.transacciones[userId] || [];
      const updatedTransactions = userTransactions.filter(t => t.id !== id);
      const nuevasTransacciones = {
        ...state.transacciones,
        [userId]: updatedTransactions
      };
      guardarTransacciones(nuevasTransacciones);
      return { transacciones: nuevasTransacciones };
    });
  },

  editarTransaccion: (id, datos) => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return;

    set((state) => {
      const userId = currentUser.username;
      const userTransactions = state.transacciones[userId] || [];
      const nuevasTransacciones = {
        ...state.transacciones,
        [userId]: userTransactions.map(t => 
          t.id === id ? { ...t, ...datos } : t
        )
      };
      guardarTransacciones(nuevasTransacciones);
      return { transacciones: nuevasTransacciones };
    });
  },
  
  establecerPerfilActivo: (perfil) => {
    set({ perfilActivo: perfil });
  },

  reiniciarTransacciones: () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return;

    set((state) => {
      const nuevasTransacciones = {
        ...state.transacciones,
        [currentUser.username]: []
      };
      guardarTransacciones(nuevasTransacciones);
      return { transacciones: nuevasTransacciones };
    });
  },
  
  obtenerBalance: () => {
    const { transacciones, perfilActivo } = get();
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return 0;

    const userTransactions = transacciones[currentUser.username] || [];
    return userTransactions
      .filter((t) => t.perfil === perfilActivo)
      .reduce((acc, curr) => {
        return acc + (curr.tipo === 'ingreso' ? curr.monto : -curr.monto);
      }, 0);
  },
  
  obtenerTotalIngresos: () => {
    const { transacciones, perfilActivo } = get();
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return 0;

    const userTransactions = transacciones[currentUser.username] || [];
    return userTransactions
      .filter((t) => t.perfil === perfilActivo && t.tipo === 'ingreso')
      .reduce((acc, curr) => acc + curr.monto, 0);
  },
  
  obtenerTotalGastos: () => {
    const { transacciones, perfilActivo } = get();
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return 0;

    const userTransactions = transacciones[currentUser.username] || [];
    return userTransactions
      .filter((t) => t.perfil === perfilActivo && t.tipo === 'gasto')
      .reduce((acc, curr) => acc + curr.monto, 0);
  },
}));