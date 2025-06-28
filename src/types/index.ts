export interface Register {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface DrinkDTO {
    id: number;
    name: string;
    price: number;
    shot: boolean;
    registerId: number;
}

export interface OrderItemDTO {
    drinkId: string;
    quantity: number;
}

export interface OrderDTO {
    id?: string;
    items: OrderItemDTO[];
    total: number;
    createdAt: string;
    registerId: string;
}

export interface CartItem {
    drink: DrinkDTO;
    quantity: number;
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';