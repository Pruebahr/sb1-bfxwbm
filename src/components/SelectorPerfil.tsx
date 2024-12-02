import React from 'react';
import { useAlmacenTransacciones } from '../store/almacenTransacciones';
import { useAuthStore } from '../store/authStore';
import { User, Briefcase } from 'lucide-react';

export const SelectorPerfil = () => {
  const { perfilActivo, establecerPerfilActivo } = useAlmacenTransacciones();
  const { currentUser, selectedProfileId } = useAuthStore();

  // Si el admin ha seleccionado un perfil para ver, deshabilitar los botones
  const isDisabled = currentUser?.isAdmin && selectedProfileId !== null;

  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      <button
        onClick={() => establecerPerfilActivo('personal')}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
          perfilActivo === 'personal'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <User size={20} />
        Personal
      </button>
      <button
        onClick={() => establecerPerfilActivo('empresa')}
        disabled={isDisabled}
        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
          perfilActivo === 'empresa'
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:bg-gray-200'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Briefcase size={20} />
        Empresa
      </button>
    </div>
  );
};