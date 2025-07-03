import React, {useState} from 'react';
import {CheckCircle, Clock, Edit3, XCircle} from 'lucide-react';
import {OrderDTO} from '../types';
import {EditOrderModal} from './EditOrderModal';

interface OrderHistoryProps {
  orders: OrderDTO[];
  onUpdateOrder: (updatedOrder: OrderDTO) => void;
  onDeleteOrder: (orderId: string) => void;
  loading?: boolean;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
                                                            orders,
                                                            onUpdateOrder,
                                                            onDeleteOrder,
                                                            loading = false
                                                          }) => {
  const [editingOrder, setEditingOrder] = useState<OrderDTO | null>(null);
  const onlyTime = (createdAt?: string) => {
    if (!createdAt) return 'N/A';
    try {
      return new Date(createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'});
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };


  if (loading) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="h-7 w-7 text-blue-600"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Hiljutised tellimused</h2>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded-lg w-32"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-24"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded-lg w-40 mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded-lg w-28"></div>
                </div>
            ))}
          </div>
        </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500"/>;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500"/>;
      default:
        return <Clock className="h-5 w-5 text-yellow-500"/>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const handleSaveOrder = (updatedOrder: OrderDTO) => {
    onUpdateOrder(updatedOrder);
    console.log(updatedOrder);
    setEditingOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    onDeleteOrder(orderId);
    setEditingOrder(null);
  };

  return (
      <>
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="h-7 w-7 text-blue-600"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Hiljutised tellimused</h2>
            <span className="bg-blue-100 text-blue-800 text-base font-semibold px-4 py-2 rounded-full">
            {orders.length}
          </span>
          </div>

          {orders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-20 w-20 text-gray-300 mx-auto mb-6"/>
                <p className="text-gray-500 text-lg">Hiljutisi tellimusi pole</p>
              </div>
          ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {orders.map((order, index) => (
                    <div key={order.id || `order-${index}`}
                         className="border-2 border-gray-100 rounded-2xl p-6 hover:bg-gray-50 hover:border-gray-200 transition-all duration-200 group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                                        <span className="font-bold text-gray-900 text-lg">
                                            {order.id ? `#${order.id.slice(-8)}` : `Order ${index + 1}`}
                                        </span>
                          <span
                              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor('COMPLETED')}`}>
                      {getStatusIcon('COMPLETED')}
                            <span className="ml-2">Esitatud</span>
                    </span>
                        </div>
                        <div className="flex items-center space-x-3">
                    <span className="text-gray-500 text-base">
                        {onlyTime(order.createdAt)}
                    </span>
                          <button
                              onClick={() => setEditingOrder(order)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <Edit3 className="h-5 w-5"/>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-base">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-green-600 text-xl">
                      €{(order.total || 0).toFixed(2)}
                    </span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {editingOrder && (
            <EditOrderModal
                order={editingOrder}
                onSave={handleSaveOrder}
                onDelete={handleDeleteOrder}
                onClose={() => setEditingOrder(null)}
            />
        )}
      </>
  );
};
