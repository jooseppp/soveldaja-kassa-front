import React from 'react';
import {Register} from '../types';

interface HeaderProps {
  selectedRegister: Register;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({selectedRegister, onLogout}) => {
  return (
      <div className="bg-white rounded-xl shadow-md p-3 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-600 font-medium">{selectedRegister.name}</span>
          </div>

          <button
              onClick={onLogout}
              className="text-red-600 hover:text-red-600 p-1 rounded-lg transition-all duration-200"
          >
            <p>Logi välja</p>
          </button>
        </div>
      </div>
  );
};
