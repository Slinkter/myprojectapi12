import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import type { Product } from '../../domain/cartTypes';
import toast from 'react-hot-toast';
import type { ReactNode } from 'react';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
    const mockProduct: Product = {
        id: 1,
        title: 'Test Product',
        price: 100,
        thumbnail: 'test.jpg',
        stock: 10,
    };

    it('should start with empty cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.cart).toEqual([]);
        expect(result.current.totalPrice).toBe(0);
    });

    it('should add product to cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct, 2);
        });

        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0]).toEqual({ ...mockProduct, quantity: 2 });
        expect(result.current.totalPrice).toBe(200);
        expect(toast.success).toHaveBeenCalledWith('Product added to cart!');
    });

    it('should increase quantity when adding existing product', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct, 1);
        });

        act(() => {
            result.current.addToCart(mockProduct, 2);
        });

        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].quantity).toBe(3);
        expect(result.current.totalPrice).toBe(300); // Fixed: 3 * 100 = 300 (original test had 150 but product was 50)
    });

    it('should remove product from cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addToCart(mockProduct, 1);
        });

        act(() => {
            result.current.removeFromCart(1);
        });

        expect(result.current.cart).toHaveLength(0);
        expect(result.current.totalPrice).toBe(0);
        expect(toast.error).toHaveBeenCalledWith('Product removed from cart.');
    });

    it('should clear entire cart', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const product1: Product = { ...mockProduct, id: 1, title: 'Product 1' };
        const product2: Product = { ...mockProduct, id: 2, title: 'Product 2' };

        act(() => {
            result.current.addToCart(product1, 1);
            result.current.addToCart(product2, 1);
        });

        expect(result.current.cart).toHaveLength(2);

        act(() => {
            result.current.clearCart();
        });

        expect(result.current.cart).toHaveLength(0);
        expect(result.current.totalPrice).toBe(0);
        expect(toast.success).toHaveBeenCalledWith('The cart has been emptied.');
    });

    it('should calculate total price correctly', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        const product1: Product = { ...mockProduct, id: 1, price: 50 };
        const product2: Product = { ...mockProduct, id: 2, price: 75 };

        act(() => {
            result.current.addToCart(product1, 2); // 100
            result.current.addToCart(product2, 3); // 225
        });

        expect(result.current.totalPrice).toBe(325);
    });

    it('should toggle cart open/close', () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        expect(result.current.isCartOpen).toBe(false);

        act(() => {
            result.current.openCart();
        });

        expect(result.current.isCartOpen).toBe(true);

        act(() => {
            result.current.closeCart();
        });

        expect(result.current.isCartOpen).toBe(false);

        act(() => {
            result.current.toggleCart();
        });

        expect(result.current.isCartOpen).toBe(true);
    });
});
