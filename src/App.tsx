import React from 'react';
import { useAuthStore } from './store/authStore';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { SelectorPerfil } from './components/SelectorPerfil';
import { TarjetasResumen } from './components/TarjetasResumen';
import { FormularioTransaccion } from './components/FormularioTransaccion';
import { GraficoTransacciones } from './components/GraficoTransacciones';
import { ListaTransacciones } from './components/ListaTransacciones';
import { BotonesAccion } from './components/BotonesAccion';
import { LogOut } from 'lucide-react';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <SelectorPerfil />
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Registro de Actividades Financieras
        </h1>

        <AdminPanel />

        <div className="mb-6">
          <BotonesAccion />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <TarjetasResumen />
            <FormularioTransaccion />
          </div>
          
          <div className="space-y-6">
            <GraficoTransacciones />
            <ListaTransacciones />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;