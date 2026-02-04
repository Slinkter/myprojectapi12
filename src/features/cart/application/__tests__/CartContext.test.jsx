import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, CartContext } from '../CartContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
    it('should start with empty cart', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        expect(result.current.cart).toEqual([]);
        expect(result.current.totalPrice).toBe(0);
    });

    it('should add product to cart', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        const product = {
            id: 1,
            title: 'Test Product',
            price: 100,
        };

        act(() => {
            result.current.addToCart(product, 2);
        });

        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0]).toEqual({ ...product, quantity: 2 });
        expect(result.current.totalPrice).toBe(200);
        expect(toast.success).toHaveBeenCalledWith('Product added to cart!');
    });

    it('should increase quantity when adding existing product', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        const product = {
            id: 1,
            title: 'Test Product',
            price: 50,
        };

        act(() => {
            result.current.addToCart(product, 1);
        });

        act(() => {
            result.current.addToCart(product, 2);
        });

        expect(result.current.cart).toHaveLength(1);
        expect(result.current.cart[0].quantity).toBe(3);
        expect(result.current.totalPrice).toBe(150);
    });

    it('should remove product from cart', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        const product = {
            id: 1,
            title: 'Test Product',
            price: 100,
        };

        act(() => {
            result.current.addToCart(product, 1);
        });

        act(() => {
            result.current.removeFromCart(1);
        });

        expect(result.current.cart).toHaveLength(0);
        expect(result.current.totalPrice).toBe(0);
        expect(toast.error).toHaveBeenCalledWith('Product removed from cart.');
    });

    it('should clear entire cart', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        const product1 = { id: 1, title: 'Product 1', price: 100 };
        const product2 = { id: 2, title: 'Product 2', price: 200 };

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
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

        const product1 = { id: 1, title: 'Product 1', price: 50 };
        const product2 = { id: 2, title: 'Product 2', price: 75 };

        act(() => {
            result.current.addToCart(product1, 2); // 100
            result.current.addToCart(product2, 3); // 225
        });

        expect(result.current.totalPrice).toBe(325);
    });

    it('should toggle cart open/close', () => {
        const { result } = renderHook(() => useContext(CartContext), { wrapper });

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
