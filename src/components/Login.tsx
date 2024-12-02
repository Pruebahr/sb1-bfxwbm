import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Lock } from 'lucide-react';
import { userAvatars } from '../utils/avatars';

export const Login = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const users = [
    { id: 1, name: 'Usuario 1', password: 'User2018', color: 'bg-blue-500' },
    { id: 2, name: 'Usuario 2', password: 'User2019', color: 'bg-yellow-500' },
    { id: 3, name: 'Usuario 3', password: 'User2020', color: 'bg-red-500' },
    { id: 4, name: 'Usuario 4', password: 'User2021', color: 'bg-green-500' },
  ];

  const handleUserSelect = (username: string) => {
    setSelectedUser(username);
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = users.find(u => u.name === selectedUser);
    if (user && login(user.name, password)) {
      setSelectedUser(null);
      setPassword('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            ¿Quién quiere acceder?
          </h2>
        </div>

        {!selectedUser ? (
          <div className="grid grid-cols-2 gap-4 mt-8">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user.name)}
                className={`${user.color} hover:opacity-80 transition-all duration-200 p-6 rounded-lg flex flex-col items-center justify-center transform hover:scale-105`}
              >
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 mx-auto">
                    <img
                      src={userAvatars[user.name as keyof typeof userAvatars]}
                      alt={user.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="font-medium text-lg">{user.name}</div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-24 h-24">
                  <img
                    src={userAvatars[selectedUser as keyof typeof userAvatars]}
                    alt={selectedUser}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-xl">
                  Hola, {selectedUser}
                </h3>
              </div>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Volver
              </button>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Acceder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};