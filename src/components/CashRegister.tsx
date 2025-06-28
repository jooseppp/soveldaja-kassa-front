import React, { useState, useEffect } from 'react';
import { Register, DrinkDTO, OrderDTO } from '../types';
import { useCart } from '../hooks/useCart';
import {
  getAllRegisters,
  getDrinksByRegister,
  createOrder,
  getAllOrders,
  deleteOrder
} from '../services/api';
import { LoginScreen } from './LoginScreen';
import { Header } from './Header';
import { DrinkMenu } from './DrinkMenu';
import { Cart } from './Cart';
import { OrderHistory } from './OrderHistory';

export const CashRegister: React.FC = () => {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<Register | null>(null);
  const [drinks, setDrinks] = useState<DrinkDTO[]>([]);
  const [orders, setOrders] = useState<OrderDTO[]>([]);
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

  // Load registers on mount
  useEffect(() => {
    const loadRegisters = async () => {
      setLoading(prev => ({ ...prev, registers: true }));
      try {
        const data = await getAllRegisters();
        setRegisters(data);
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
            const loadOrders = async () => {
                try {
                    const data = await getAllOrders();
                    if (Array.isArray(data)) {
                        setOrders(
                            data.sort((a, b) =>
                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            )
                        );
                    } else {
                        throw new Error('Data is not an array');
                    }
                } catch (error) {
                    // setError(error); // if you have error state
                    console.error('Failed to load orders:', error);
                }
            };
            loadOrders();
        }
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

      // Reload orders
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders);

    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, checkout: false }));
    }
  };

  const handleUpdateOrder = async (updatedOrder: OrderDTO) => {
    // In a real app, you'd call an API to update the order
    // For now, we'll just update the local state
    setOrders(prev =>
      prev.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  const handleLogout = () => {
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
      </div>
    </div>
  );
};