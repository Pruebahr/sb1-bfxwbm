import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { UserPlus, Trash2, Eye, EyeOff, Lock } from 'lucide-react';

export const AdminPanel = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { profiles, createProfile, deleteProfile, selectProfile, selectedProfileId } = useAuthStore();
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername.trim() || !newPassword.trim()) {
      alert('Por favor, complete todos los campos');
      return;
    }

    if (createProfile(newUsername, newPassword)) {
      setNewUsername('');
      setNewPassword('');
      setShowPassword(false);
      setShowCreateForm(false);
    }
  };

  const handleDeleteProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (profile?.username === 'Finanzas1') {
      alert('No se puede eliminar el usuario predefinido Finanzas1');
      return;
    }

    const confirmDelete = window.confirm(
      '¿Está seguro de que desea eliminar este perfil?\n' +
      'Esta acción eliminará permanentemente todos los datos asociados y no se puede deshacer.'
    );
    
    if (confirmDelete) {
      deleteProfile(id);
    }
  };

  if (!currentUser?.isAdmin) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Panel de Administración</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={profiles.length >= 5}
        >
          <UserPlus size={20} />
          Crear Nuevo Perfil ({profiles.length}/5)
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateProfile} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Ingrese el nombre de usuario"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingrese la contraseña"
                  className="w-full px-3 py-2 border rounded-lg pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Perfil
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Perfiles Disponibles:</h3>
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{profile.username}</p>
                {profile.username === 'Finanzas1' && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    <Lock size={12} className="mr-1" />
                    Predefinido
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Creado el: {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => selectProfile(selectedProfileId === profile.id ? null : profile.id)}
                className={`p-2 rounded-lg ${
                  selectedProfileId === profile.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'hover:bg-gray-200 text-gray-600'
                }`}
                title={selectedProfileId === profile.id ? "Dejar de ver perfil" : "Ver perfil"}
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => handleDeleteProfile(profile.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                disabled={profile.username === 'Finanzas1'}
                title={profile.username === 'Finanzas1' ? "No se puede eliminar" : "Eliminar perfil"}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {profiles.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No hay perfiles creados
          </p>
        )}
      </div>
    </div>
  );
};