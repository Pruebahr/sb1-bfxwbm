import React, { useState } from 'react';
import { useAlmacenTransacciones } from '../store/almacenTransacciones';
import { TipoTransaccion } from '../tipos';
import { format } from 'date-fns';
import { categoriasIngresos, categoriasGastos } from '../utils/categorias';

export const FormularioTransaccion = () => {
  const { agregarTransaccion, perfilActivo } = useAlmacenTransacciones();
  const [tipo, setTipo] = useState<TipoTransaccion>('ingreso');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [comprobante, setComprobante] = useState<File | null>(null);

  const categorias = tipo === 'ingreso' ? categoriasIngresos : categoriasGastos;

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let urlComprobante = '';
    if (comprobante) {
      urlComprobante = URL.createObjectURL(comprobante);
    }

    agregarTransaccion({
      tipo,
      monto: parseFloat(monto),
      fecha: new Date(fecha),
      descripcion,
      categoria,
      perfil: perfilActivo,
      urlComprobante,
    });

    setMonto('');
    setDescripcion('');
    setCategoria('');
    setFecha(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setComprobante(null);
  };

  return (
    <form onSubmit={manejarEnvio} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => setTipo('ingreso')}
          className={`flex-1 py-2 rounded-lg ${
            tipo === 'ingreso'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Ingreso
        </button>
        <button
          type="button"
          onClick={() => setTipo('gasto')}
          className={`flex-1 py-2 rounded-lg ${
            tipo === 'gasto'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Gasto
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha y Hora
          </label>
          <input
            type="datetime-local"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto
          </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen del Comprobante
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setComprobante(e.target.files?.[0] || null)}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Agregar Transacción
        </button>
      </div>
    </form>
  );
};