import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useAlmacenTransacciones } from '../store/almacenTransacciones';

export const TarjetasResumen = () => {
  const { obtenerTotalIngresos, obtenerTotalGastos, obtenerBalance } = useAlmacenTransacciones();

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-green-600 mb-2">
          <TrendingUp size={24} />
          <h3 className="text-xl font-medium">Ingresos</h3>
        </div>
        <p className="text-3xl font-bold">${obtenerTotalIngresos().toFixed(2)}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-red-600 mb-2">
          <TrendingDown size={24} />
          <h3 className="text-xl font-medium">Gastos</h3>
        </div>
        <p className="text-3xl font-bold">${obtenerTotalGastos().toFixed(2)}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Wallet size={24} />
          <h3 className="text-xl font-medium">Balance</h3>
        </div>
        <p className="text-3xl font-bold">${obtenerBalance().toFixed(2)}</p>
      </div>
    </div>
  );
};