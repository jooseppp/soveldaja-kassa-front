import { useState, useCallback } from 'react';
import { CartItem, DrinkDTO } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((drink: DrinkDTO, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.drink.id === drink.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.drink.id === drink.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { drink, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((drinkId: number) => {
    setCartItems(prev => prev.filter(item => item.drink.id !== drinkId));
  }, []);

  const updateQuantity = useCallback((drinkId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(drinkId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.drink.id === drinkId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.drink.price * item.quantity), 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};