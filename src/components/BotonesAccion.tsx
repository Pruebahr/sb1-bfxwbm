import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useAlmacenTransacciones } from '../store/almacenTransacciones';
import { guardarTransacciones } from '../utils/almacenamiento';

export const BotonesAccion = () => {
  const { transacciones, reiniciarTransacciones } = useAlmacenTransacciones();

  const manejarGuardado = () => {
    guardarTransacciones(transacciones);
    alert('¡Transacciones guardadas exitosamente!');
  };

  const manejarReinicio = () => {
    const confirmarReinicio = window.confirm(
      'Advertencia: Esta acción eliminará permanentemente todos sus datos de transacciones.\n\n' +
      '¿Está completamente seguro de que desea reiniciar todo a cero?\n\n' +
      'Esta acción no se puede deshacer.'
    );
    
    if (confirmarReinicio) {
      const confirmacionFinal = window.prompt(
        'Para confirmar el reinicio, escriba "REINICIAR" en mayúsculas:'
      );
      
      if (confirmacionFinal === 'REINICIAR') {
        reiniciarTransacciones();
        alert('Todas las transacciones han sido reiniciadas exitosamente.');
      } else if (confirmacionFinal !== null) {
        alert('Reinicio cancelado: Texto de confirmación incorrecto.');
      }
    }
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={manejarGuardado}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Save size={20} />
        Guardar Datos
      </button>
      <button
        onClick={manejarReinicio}
        className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <Trash2 size={20} />
        Reiniciar Todo
      </button>
    </div>
  );
};