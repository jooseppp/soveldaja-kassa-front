import React from 'react';
import { LogOut } from 'lucide-react';
import { Register } from '../types';

interface HeaderProps {
  selectedRegister: Register;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ selectedRegister, onLogout }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-gray-600 font-medium">{selectedRegister.name}</span>
        </div>

        <button
          onClick={onLogout}
          className="text-gray-600 hover:text-red-600 p-1 rounded-lg transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
