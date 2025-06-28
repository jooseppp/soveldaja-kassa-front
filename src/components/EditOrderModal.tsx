import React, {useState} from 'react';
import {Minus, Plus, Save, Trash2, X} from 'lucide-react';
import {OrderDTO, OrderItemDTO} from '../types';

interface EditOrderModalProps {
  order: OrderDTO;
  onSave: (updatedOrder: OrderDTO) => void;
  onDelete: (orderId: string) => void;
  onClose: () => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
                                                                order,
                                                                onSave,
                                                                onDelete,
                                                                onClose,
                                                              }) => {
  const [editedItems, setEditedItems] = useState<OrderItemDTO[]>([...(order.items || [])]);

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setEditedItems(prev => prev.filter((_, i) => i !== index));
      return;
    }

    setEditedItems(prev =>
        prev.map((item, i) =>
            i === index ? {...item, quantity} : item
        )
    );
  };

  const calculateTotal = () => {
    // Note: In a real app, you'd need drink prices to calculate this properly
    // For now, we'll use a simplified calculation
    return editedItems.reduce((total, item) => total + (item.quantity * 5), 0); // Assuming $5 per item
  };

  const handleSave = () => {
    const updatedOrder: OrderDTO = {
      ...order,
      items: editedItems,
      total: calculateTotal(),
    };
    onSave(updatedOrder);
  };

  const handleDelete = () => {
    if (order.id && window.confirm('Are you sure you want to delete this order?')) {
      onDelete(order.id);
    }
  };

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Order</h2>
              <p className="text-gray-600 mt-1">{order.id ? `#${order.id.slice(-8)}` : 'New Order'}</p>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            >
              <X className="h-6 w-6"/>
            </button>
          </div>

          <div className="p-8 max-h-96 overflow-y-auto">
            {editedItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">No items in this order</p>
                </div>
            ) : (
                <div className="space-y-4">
                  {editedItems.map((item, index) => (
                      <div key={index} className="border-2 border-gray-100 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Drink
                              #{item.drinkId}</h3>
                            <p className="text-gray-500">$5.00 each</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            >
                              <Minus className="h-4 w-4 text-gray-600"/>
                            </button>

                            <span className="font-bold text-gray-900 text-lg min-w-[2rem] text-center">
                        {item.quantity}
                      </span>

                            <button
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                            >
                              <Plus className="h-4 w-4 text-gray-600"/>
                            </button>
                          </div>

                          <p className="font-bold text-blue-600 text-lg">
                            ${(item.quantity * 5).toFixed(2)}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
              ${calculateTotal().toFixed(2)}
            </span>
            </div>

            <div className="flex space-x-4">
              <button
                  onClick={handleDelete}
                  disabled={!order.id}
                  className={`flex-1 ${order.id ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                <Trash2 className="h-5 w-5"/>
                <span>Kustuta tellimus</span>
              </button>

              <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5"/>
                <span>Salvesta muudatused</span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};
