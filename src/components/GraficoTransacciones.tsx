import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useAlmacenTransacciones } from '../store/almacenTransacciones';
import { useAuthStore } from '../store/authStore';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

ChartJS.register(ArcElement, Tooltip, Legend);

export const GraficoTransacciones = () => {
  const { transacciones, perfilActivo } = useAlmacenTransacciones();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());

  if (!currentUser) return null;

  // Generar array de años desde 2013 hasta 2040
  const años = Array.from(
    { length: 2040 - 2013 + 1 },
    (_, i) => 2013 + i
  );

  const transaccionesUsuario = transacciones[currentUser.username] || [];

  // Filtrar transacciones por mes y año seleccionados
  const transaccionesFiltradas = transaccionesUsuario.filter((t) => {
    const fecha = new Date(t.fecha);
    return (
      t.perfil === perfilActivo &&
      fecha >= startOfMonth(new Date(añoSeleccionado, mesSeleccionado)) &&
      fecha <= endOfMonth(new Date(añoSeleccionado, mesSeleccionado))
    );
  });

  const ingresos = transaccionesFiltradas
    .filter((t) => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);

  const gastos = transaccionesFiltradas
    .filter((t) => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  const data = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        data: [ingresos, gastos],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Distribución de Transacciones</h2>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mes
          </label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {format(new Date(2000, i), 'MMMM', { locale: es })}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <select
            value={añoSeleccionado}
            onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg"
          >
            {años.map((año) => (
              <option key={año} value={año}>
                {año}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        {ingresos === 0 && gastos === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay transacciones para el período seleccionado
          </p>
        ) : (
          <Pie data={data} options={options} />
        )}
      </div>
    </div>
  );
};