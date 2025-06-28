import React from 'react';
import {Store, ChevronDown, Coffee} from 'lucide-react';
import {Register} from '../types';

interface LoginScreenProps {
    registers: Register[];
    onSelectRegister: (register: Register) => void;
    loading?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
                                                            registers,
                                                            onSelectRegister,
                                                            loading = false,
                                                        }) => {
    const [selectedRegisterId, setSelectedRegisterId] = React.useState<string>('');

    const handleLogin = () => {
        const register = registers.find(r => r.id === parseInt(selectedRegisterId));
        if (register) {
            onSelectRegister(register);
        }
    };

    if (loading) {
        return (
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gray-200 rounded-2xl mx-auto mb-6 animate-pulse"></div>
                        <div className="h-8 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
                <div className="text-center mb-8">
                    <div
                        className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <Coffee className="h-10 w-10 text-blue-600"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Tere-tulemast</h1>
                    <p className="text-gray-600 text-lg">Vali enda kassa</p>
                </div>

                {registers.length === 0 ? (
                    <div className="text-center py-8">
                        <Store className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500 text-lg">Ühtegi kassat pole, NET maas</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="relative">
                            <select
                                value={selectedRegisterId}
                                onChange={(e) => setSelectedRegisterId(e.target.value)}
                                className="w-full p-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 appearance-none bg-white cursor-pointer transition-all duration-200 hover:border-gray-300"
                            >
                                <option value="">Vali enda kassa...</option>
                                {registers.map((register) => (
                                    <option key={register.id} value={register.id}>
                                        {register.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none"/>
                        </div>

                        <button
                            onClick={handleLogin}
                            disabled={!selectedRegisterId}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-2xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Logi sisse
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};