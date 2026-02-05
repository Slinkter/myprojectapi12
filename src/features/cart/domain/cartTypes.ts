/**
 * Tipos de dominio para el carrito de compras.
 */

export interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
    stock: number;
}

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    stock: number;
}

export interface ValidationResult {
    valid: boolean;
    error: string | null;
}
