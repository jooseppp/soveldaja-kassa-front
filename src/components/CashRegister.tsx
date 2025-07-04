import React, { useState, useEffect } from 'react';
import { Register, DrinkDTO, OrderDTO } from '../types';
import { useCart } from '../hooks/useCart';
import {
  getAllRegisters,
  getDrinksByRegister,
  createOrder,
  deleteOrder,
  getLastOrderByRegister,
  updateOrder
} from '../services/api';
import { LoginScreen } from './LoginScreen';
import { Header } from './Header';
import { DrinkMenu } from './DrinkMenu';
import { Cart } from './Cart';
import { OrderHistory } from './OrderHistory';

// Error message component
const ErrorMessage: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center justify-between" role="alert">
      <div>
        <span className="font-bold">Error: </span>
        <span className="block sm:inline">{message}</span>
      </div>
      <button onClick={onClose} className="ml-4 text-red-700 hover:text-red-900">
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );
};

export const CashRegister: React.FC = () => {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);
  const [drinks, setDrinks] = useState<DrinkDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState({
    registers: false,
    drinks: false,
    orders: false,
    checkout: false,
  });

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  // Load registers on mount and check for saved register
  useEffect(() => {
    const loadRegisters = async () => {
      setLoading(prev => ({ ...prev, registers: true }));
      try {
        const data = await getAllRegisters();
        setRegisters(data);

        // Check if there's a saved register ID in localStorage
        const savedRegisterId = localStorage.getItem('selectedRegisterId');
        if (savedRegisterId) {
          const savedRegister = data.find(register => register.id === parseInt(savedRegisterId));
          if (savedRegister) {
            setSelectedRegister(savedRegister);
          }
        }
      } catch (error) {
        console.error('Failed to load registers:', error);
      } finally {
        setLoading(prev => ({ ...prev, registers: false }));
      }
    };

    loadRegisters();
  }, []);

  // Load drinks when register is selected
  useEffect(() => {
    if (!selectedRegister) {
      setDrinks([]);
      return;
    }

    const loadDrinks = async () => {
      setLoading(prev => ({ ...prev, drinks: true }));
      try {
        const data = await getDrinksByRegister(selectedRegister.id);
        setDrinks(data);
      } catch (error) {
        console.error('Failed to load drinks:', error);
        setDrinks([]);
      } finally {
        setLoading(prev => ({ ...prev, drinks: false }));
      }
    };

    loadDrinks();
  }, [selectedRegister]);

  // Load orders when register is selected
  useEffect(() => {
    if (!selectedRegister) {
      setOrders([]);
      return;
    }

    const loadOrders = async () => {
      setLoading(prev => ({ ...prev, orders: true }));
      try {
        // Use the new endpoint to get the last order for the selected register
        const lastOrder = await getLastOrderByRegister(selectedRegister.id);
        console.log('Last order in CashRegister:', lastOrder);

        // If we got a valid response, set the orders
        if (lastOrder) {
          // Check if lastOrder is an array
          if (Array.isArray(lastOrder)) {
            setOrders(lastOrder);
          } else {
            // If it's a single order, put it in an array
            setOrders([lastOrder]);
          }
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Failed to load last order:', error);
        setOrders([]);
      } finally {
        setLoading(prev => ({ ...prev, orders: false }));
      }
    };

    loadOrders();
  }, [selectedRegister]);


  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setLoading(prev => ({ ...prev, checkout: true }));

    try {
      const orderData = {
        items: cartItems.map(item => ({
          drinkId: item.drink.id.toString(),
          quantity: item.quantity,
        })),
        total: getTotalPrice(),
      };

      await createOrder(orderData);
      clearCart();

      // Reload the last order for the selected register
      if (selectedRegister) {
        const lastOrder = await getLastOrderByRegister(selectedRegister.id);
        console.log('Last order after checkout:', lastOrder);
        if (lastOrder) {
          // Check if lastOrder is an array
          if (Array.isArray(lastOrder)) {
            setOrders(lastOrder);
          } else {
            // If it's a single order, put it in an array
            setOrders([lastOrder]);
          }
        }
      }

    } catch (error) {
      console.error('Failed to create order:', error);
      setErrorMessage('Failed to process order. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  };

  const handleZeroCheckout = async () => {
    if (cartItems.length === 0) return;

    setLoading(prev => ({ ...prev, checkout: true }));

    try {
      const orderData = {
        items: cartItems.map(item => ({
          drinkId: item.drink.id.toString(),
          quantity: item.quantity,
        })),
        total: 0, // Set total to 0 for zero-euro orders
      };

      await createOrder(orderData);
      clearCart();

      // Reload the last order for the selected register
      if (selectedRegister) {
        const lastOrder = await getLastOrderByRegister(selectedRegister.id);
        console.log('Last order after zero checkout:', lastOrder);
        if (lastOrder) {
          // Check if lastOrder is an array
          if (Array.isArray(lastOrder)) {
            setOrders(lastOrder);
          } else {
            // If it's a single order, put it in an array
            setOrders([lastOrder]);
          }
        }
      }

    } catch (error) {
      console.error('Failed to create zero-euro order:', error);
      setErrorMessage('Failed to process zero-euro order. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  };

  const handleUpdateOrder = async (updatedOrder: OrderDTO) => {
    try {
      if (updatedOrder.id) {
        // Call the API to update the order in the database
        const updatedOrderFromBackend = await updateOrder(updatedOrder.id, updatedOrder);

        // Update the local state with the response from the backend
        setOrders(prev =>
          prev.map(order =>
            order.id === updatedOrder.id ? updatedOrderFromBackend : order
          )
        );
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      setErrorMessage('Failed to update order. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to delete order:', error);
      setErrorMessage('Failed to delete order. Please try again.');
    }
  };

  const handleLogout = () => {
    // Clear the register ID from localStorage
    localStorage.removeItem('selectedRegisterId');
    setSelectedRegister(null);
    clearCart();
    setDrinks([]);
    setOrders([]);
  };

  // Show login screen if no register is selected
  if (!selectedRegister) {
    return (
      <LoginScreen
        registers={registers}
        onSelectRegister={setSelectedRegister}
        loading={loading.registers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        <Header
          selectedRegister={selectedRegister}
          onLogout={handleLogout}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          <div className="xl:col-span-2">
            <DrinkMenu
              drinks={drinks}
              onAddToCart={addToCart}
              loading={loading.drinks}
            />
          </div>

          <div className="xl:col-span-1">
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
              onZeroCheckout={handleZeroCheckout}
              totalPrice={getTotalPrice()}
              totalItems={getTotalItems()}
              loading={loading.checkout}
            />
          </div>
        </div>

        <OrderHistory
          orders={orders}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrder}
          loading={loading.orders}
        />

        {/* Error message component */}
        <ErrorMessage 
          message={errorMessage} 
          onClose={() => setErrorMessage('')} 
        />
      </div>
    </div>
  );
};
