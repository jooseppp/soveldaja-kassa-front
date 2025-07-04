import React from 'react';
import {Minus, Plus, ShoppingCart, Trash2, X} from 'lucide-react';
import {CartItem} from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (drinkId: number, quantity: number) => void;
  onRemoveItem: (drinkId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onZeroCheckout: () => void;
  totalPrice: number;
  totalItems: number;
  loading?: boolean;
}

export const Cart: React.FC<CartProps> = ({
                                            cartItems,
                                            onUpdateQuantity,
                                            onRemoveItem,
                                            onClearCart,
                                            onCheckout,
                                            onZeroCheckout,
                                            totalPrice,
                                            totalItems,
                                            loading = false,
                                          }) => {
  if (cartItems.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Arve</h2>
          </div>

          <div className="text-center py-6">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3"/>
            <p className="text-gray-500 text-base">Arve on tühi</p>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-blue-600"/>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Arve</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full">
            {totalItems}
          </span>
          </div>

          <button
              onClick={onClearCart}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Clear cart"
          >
            <Trash2 className="h-5 w-5"/>
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {cartItems.map((item) => (
              <div key={item.drink.id}
                   className="border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base">{item.drink.name}</h3>
                    <p className="text-gray-500 text-sm">€{(item.drink.price).toFixed(2)} tk</p>
                  </div>
                  <button
                      onClick={() => onRemoveItem(item.drink.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
                  >
                    <X className="h-4 w-4"/>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onUpdateQuantity(item.drink.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
                    >
                      <Minus className="h-4 w-4 text-gray-600"/>
                    </button>

                    <span className="font-bold text-gray-900 text-base min-w-[2rem] text-center">
                  {item.quantity}
                </span>

                    <button
                        onClick={() => onUpdateQuantity(item.drink.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95"
                    >
                      <Plus className="h-4 w-4 text-gray-600"/>
                    </button>
                  </div>

                  <p className="font-bold text-blue-600 text-base">
                    €{(item.drink.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-lg font-bold text-gray-900">Kokku</span>
            <span className="text-xl font-bold text-blue-600">
            €{(totalPrice).toFixed(2)}
          </span>
          </div>
          <p className="text-gray-500 text-sm">{totalItems} jook</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
              onClick={onCheckout}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg active:scale-95"
          >
            {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Töötlen...</span>
                </>
            ) : (
                <>
                  <ShoppingCart className="h-5 w-5"/>
                  <span>Osta</span>
                </>
            )}
          </button>
          <button
              onClick={onZeroCheckout}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingCart className="h-5 w-5"/>
            <span>0€ Osta</span>
          </button>
        </div>
      </div>
  );
};
