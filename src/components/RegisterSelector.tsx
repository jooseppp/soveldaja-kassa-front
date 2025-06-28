import React from 'react';
import { Store, ChevronDown } from 'lucide-react';
import { Register } from '../types';

interface RegisterSelectorProps {
  registers: Register[];
  selectedRegister: Register | null;
  onSelectRegister: (register: Register) => void;
  loading?: boolean;
}

export const RegisterSelector: React.FC<RegisterSelectorProps> = ({
  registers,
  selectedRegister,
  onSelectRegister,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Store className="h-7 w-7 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Select Register</h2>
      </div>
      
      {registers.length === 0 ? (
        <p className="text-gray-500 text-lg">No registers available</p>
      ) : (
        <div className="relative">
          <select
            value={selectedRegister?.id || ''}
            onChange={(e) => {
              const register = registers.find(r => r.id === parseInt(e.target.value));
              if (register) onSelectRegister(register);
            }}
            className="w-full p-5 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all duration-200 hover:border-gray-300"
          >
            <option value="">Choose a register...</option>
            {registers.map((register) => (
              <option key={register.id} value={register.id}>
                {register.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" />
        </div>
      )}
      
      {selectedRegister && (
        <div className="mt-6 p-5 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-blue-900 text-lg">
            <span className="font-semibold">Active Register:</span> {selectedRegister.name}
          </p>
        </div>
      )}
    </div>
  );
};