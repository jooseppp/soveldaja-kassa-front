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

export const createDrink = async (drink: { name: string; price: number; shot: boolean; registerId: number }) => {
  const response = await fetch(`${API_BASE_URL}/drinks/create-drink`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(drink),
  });
  if (!response.ok) throw new Error('Failed to create drink');
  return response.json();
};

export const assignDrinkToRegister = async (drinkId: number, registerId: number) => {
  const response = await fetch(`${API_BASE_URL}/drinks/${drinkId}/register/${registerId}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to assign drink to register');
  return response.json();
};

// Order API
export const createOrder = async (order: { items: { drinkId: string; quantity: number }[]; total: number }) => {
  // Get the register ID from localStorage
  const registerId = localStorage.getItem('selectedRegisterId');
  if (!registerId) {
    throw new Error('No register selected');
  }

  // Include the register ID in the order
  const orderWithRegisterId = {
    ...order,
    registerId: parseInt(registerId)
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderWithRegisterId),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json();
};

export const getAllOrders = async (status?: string, customerId?: string) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (customerId) params.append('customerId', customerId);

  // Get the register ID from localStorage
  const registerId = localStorage.getItem('selectedRegisterId');
  if (registerId) {
    params.append('registerId', registerId);
  }

  const response = await fetch(`${API_BASE_URL}/orders/getAll?${params}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

// Get the last order for a specific register
export const getLastOrderByRegister = async (registerId: number) => {
  console.log(`Fetching last order for register ${registerId}`);
  const response = await fetch(`${API_BASE_URL}/orders/register/${registerId}/last`);
  if (!response.ok) throw new Error('Failed to fetch last order');
  const data = await response.json();
  console.log('Last order response:', data);
  return data;
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
