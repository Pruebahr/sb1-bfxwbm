import React, { useState } from 'react';
import { useAlmacenTransacciones } from '../store/almacenTransacciones';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Trash2, Edit2, X } from 'lucide-react';

export const ListaTransacciones = () => {
  const { transacciones, perfilActivo, eliminarTransaccion, editarTransaccion } = useAlmacenTransacciones();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);
  const [transaccionEditando, setTransaccionEditando] = useState<string | null>(null);
  const [descripcionEdit, setDescripcionEdit] = useState('');
  const [montoEdit, setMontoEdit] = useState('');
  const [categoriaEdit, setCategoriaEdit] = useState('');

  if (!currentUser) return null;

  const transaccionesUsuario = transacciones[currentUser.username] || [];
  const transaccionesFiltradas = transaccionesUsuario.filter(t => t.perfil === perfilActivo);

  const confirmarEliminacion = (id: string) => {
    const palabraSeguridad = prompt('Para confirmar la eliminación, escriba "ELIMINAR":');
    if (palabraSeguridad === 'ELIMINAR') {
      eliminarTransaccion(id);
    }
  };

  const iniciarEdicion = (transaccion: any) => {
    setTransaccionEditando(transaccion.id);
    setDescripcionEdit(transaccion.descripcion);
    setMontoEdit(transaccion.monto.toString());
    setCategoriaEdit(transaccion.categoria);
  };

  const guardarEdicion = (id: string) => {
    editarTransaccion(id, {
      descripcion: descripcionEdit,
      monto: parseFloat(montoEdit),
      categoria: categoriaEdit
    });
    setTransaccionEditando(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Historial de Transacciones</h2>
      </div>
      <div className="divide-y">
        {transaccionesFiltradas.map((transaccion) => (
          <div key={transaccion.id} className="p-4 hover:bg-gray-50">
            {transaccionEditando === transaccion.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={descripcionEdit}
                  onChange={(e) => setDescripcionEdit(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  value={montoEdit}
                  onChange={(e) => setMontoEdit(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  step="0.01"
                />
                <input
                  type="text"
                  value={categoriaEdit}
                  onChange={(e) => setCategoriaEdit(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => guardarEdicion(transaccion.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setTransaccionEditando(null)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{transaccion.descripcion}</p>
                  <p className="text-sm text-gray-500">
                    {format(transaccion.fecha, 'PPp', { locale: es })} • {transaccion.categoria}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`font-semibold ${
                    transaccion.tipo === 'ingreso' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaccion.tipo === 'ingreso' ? '+' : '-'}${transaccion.monto.toFixed(2)}
                  </div>
                  <button
                    onClick={() => iniciarEdicion(transaccion)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmarEliminacion(transaccion.id)}
                    className="p-1 hover:bg-gray-100 rounded text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
            {transaccion.urlComprobante && (
              <div className="mt-2">
                <img
                  src={transaccion.urlComprobante}
                  alt="Comprobante"
                  className="h-20 object-cover rounded cursor-pointer"
                  onClick={() => setImagenAmpliada(transaccion.urlComprobante)}
                />
              </div>
            )}
          </div>
        ))}
        {transaccionesFiltradas.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay transacciones aún
          </div>
        )}
      </div>

      {imagenAmpliada && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setImagenAmpliada(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-1"
            >
              <X size={24} />
            </button>
            <img
              src={imagenAmpliada}
              alt="Comprobante ampliado"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};