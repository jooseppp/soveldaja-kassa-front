const API_BASE_URL = 'http://localhost:8080/api';

// Register API
export const getAllRegisters = async () => {
  const response = await fetch(`${API_BASE_URL}/register`);
  if (!response.ok) throw new Error('Failed to fetch registers');
  return response.json();
};

// Drink API
export const getDrinksByRegister = async (registerId: number) => {
  const response = await fetch(`${API_BASE_URL}/drinks/${registerId}`);
  if (!response.ok) throw new Error('Failed to fetch drinks');
  return response.json();
};

export const getDrinkById = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/drinks/drink/${id}`);
  if (!response.ok) throw new Error('Failed to fetch drink');
  return response.json();
};

// Order API
export const createOrder = async (order: { items: { drinkId: string; quantity: number }[]; total: number }) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
};

export const getAllOrders = async (status?: string, customerId?: string) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (customerId) params.append('customerId', customerId);
  
  const response = await fetch(`${API_BASE_URL}/orders/getAll?${params}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const getOrderById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
};

export const deleteOrder = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete order');
  return response.json();
};