import React from 'react';
import {DrinkDTO} from '../types';

interface DrinkCardProps {
  drink: DrinkDTO;
  onAddToCart: (drink: DrinkDTO) => void;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({drink, onAddToCart}) => {
  // Pick background-color classes based on properties
  let cardBg = "bg-white";

  // Special styling for specific drinks
  if (drink.name === "panditops" || drink.name === "pandipokaal") {
    cardBg = "bg-purple-200"; // Purple background for special drinks
  } else if (drink.shot) {
    cardBg = "bg-orange-100"; // Orange background for shots
  }

  if (drink.shot) {
    console.log("shots")
  }

  return (
      <div
          onClick={() => onAddToCart(drink)}
          className={`${cardBg} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer p-4`}>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2 leading-tight">
          {drink.name}
        </h3>

        <div className="flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                    €{(drink.price).toFixed(2)}
                </span>
        </div>
      </div>
  );
};
