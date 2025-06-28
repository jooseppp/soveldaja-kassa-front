import React from 'react';
import {Coffee, GlassWater} from 'lucide-react';
import {DrinkDTO} from '../types';
import {DrinkCard} from './DrinkCard';

interface DrinkMenuProps {
  drinks: DrinkDTO[];
  onAddToCart: (drink: DrinkDTO) => void;
  loading?: boolean;
}

export const DrinkMenu: React.FC<DrinkMenuProps> = ({drinks, onAddToCart, loading = false}) => {
  if (loading) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Coffee className="h-7 w-7 text-blue-600"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Menüü</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl p-8 animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-2xl mx-auto mb-6"></div>
                  <div className="h-6 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded-lg mb-6 w-24 mx-auto"></div>
                  <div className="h-12 bg-gray-200 rounded-xl"></div>
                </div>
            ))}
          </div>
        </div>
    );
  }

  // Separate drinks into regular drinks and shots
  const regularDrinks = drinks.filter(drink => !drink.shot);
  const shots = drinks.filter(drink => drink.shot);

  return (
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Coffee className="h-7 w-7 text-blue-600"/>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Menüü</h2>
          <span className="bg-blue-100 text-blue-800 text-base font-semibold px-4 py-2 rounded-full">
          {drinks.length} items
        </span>
        </div>

        {drinks.length === 0 ? (
            <div className="text-center py-16">
              <Coffee className="h-20 w-20 text-gray-300 mx-auto mb-6"/>
              <p className="text-gray-500 text-xl">No drinks available for this register</p>
            </div>
        ) : (
            <div className="space-y-10">
              {regularDrinks.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Coffee className="h-6 w-6 text-blue-600"/>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Joogid</h3>
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {regularDrinks.length} items
                </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {regularDrinks.map((drink) => (
                          <DrinkCard
                              key={drink.id}
                              drink={drink}
                              onAddToCart={onAddToCart}
                          />
                      ))}
                    </div>
                  </div>
              )}

              {shots.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <GlassWater className="h-6 w-6 text-orange-600"/>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Shotid</h3>
                      <span className="bg-orange-100 text-orange-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {shots.length} items
                </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {shots.map((drink) => (
                          <DrinkCard
                              key={drink.id}
                              drink={drink}
                              onAddToCart={onAddToCart}
                          />
                      ))}
                    </div>
                  </div>
              )}
            </div>
        )}
      </div>
  );
};
