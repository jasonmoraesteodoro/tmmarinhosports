import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Painel Administrativo</h2>
          <p className="text-gray-600">Gerencie seus alunos e mensalidades</p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
            <div className="w-8 h-8 bg-orange-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;