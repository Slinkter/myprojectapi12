/**
 * Tests para las utilidades del carrito (domain layer).
 */
import { describe, test, expect } from "vitest";
import {
    calculateTotal,
    addItemToCart,
    removeItemFromCart,
    validateCartItem,
} from "../cartUtils";
import type { CartItem, Product } from "../cartTypes";

describe("cartUtils", () => {
    describe("calculateTotal", () => {
        test("calcula el total correctamente", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Product 1",
                    price: 10,
                    quantity: 2,
                    thumbnail: "img1.jpg",
                    stock: 10,
                },
                {
                    id: 2,
                    title: "Product 2",
                    price: 5,
                    quantity: 3,
                    thumbnail: "img2.jpg",
                    stock: 10,
                },
            ];

            expect(calculateTotal(cart)).toBe(35); // (10*2) + (5*3) = 35
        });

        test("retorna 0 para carrito vacío", () => {
            expect(calculateTotal([])).toBe(0);
        });

        test("maneja decimales correctamente", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Product",
                    price: 9.99,
                    quantity: 3,
                    thumbnail: "img.jpg",
                    stock: 10,
                },
            ];

            expect(calculateTotal(cart)).toBeCloseTo(29.97, 2);
        });
    });

    describe("addItemToCart", () => {
        test("agrega nuevo producto al carrito vacío", () => {
            const cart: CartItem[] = [];
            const product: Product = {
                id: 1,
                title: "Test Product",
                price: 10,
                thumbnail: "test.jpg",
                stock: 10,
            };

            const result = addItemToCart(cart, product, 1);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ ...product, quantity: 1 });
        });

        test("incrementa cantidad si producto ya existe", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Test Product",
                    price: 10,
                    quantity: 2,
                    thumbnail: "test.jpg",
                    stock: 10,
                },
            ];
            const product: Product = {
                id: 1,
                title: "Test Product",
                price: 10,
                thumbnail: "test.jpg",
                stock: 10,
            };

            const result = addItemToCart(cart, product, 3);

            expect(result).toHaveLength(1);
            expect(result[0].quantity).toBe(5); // 2 + 3
        });

        test("agrega nuevo producto sin afectar existentes", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Product 1",
                    price: 10,
                    quantity: 1,
                    thumbnail: "img1.jpg",
                    stock: 10,
                },
            ];
            const product: Product = {
                id: 2,
                title: "Product 2",
                price: 20,
                thumbnail: "img2.jpg",
                stock: 10,
            };

            const result = addItemToCart(cart, product, 1);

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(2);
        });
    });

    describe("removeItemFromCart", () => {
        test("elimina producto del carrito", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Product 1",
                    price: 10,
                    quantity: 1,
                    thumbnail: "img1.jpg",
                    stock: 10,
                },
                {
                    id: 2,
                    title: "Product 2",
                    price: 20,
                    quantity: 1,
                    thumbnail: "img2.jpg",
                    stock: 10,
                },
            ];

            const result = removeItemFromCart(cart, 1);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(2);
        });

        test("retorna carrito vacío si se elimina el único producto", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Product",
                    price: 10,
                    quantity: 1,
                    thumbnail: "img.jpg",
                    stock: 10,
                },
            ];

            const result = removeItemFromCart(cart, 1);

            expect(result).toHaveLength(0);
        });

        test("no afecta el carrito si el ID no existe", () => {
            const cart: CartItem[] = [
                {
                    id: 1,
                    title: "Product",
                    price: 10,
                    quantity: 1,
                    thumbnail: "img.jpg",
                    stock: 10,
                },
            ];

            const result = removeItemFromCart(cart, 999);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe(1);
        });
    });

    describe("validateCartItem", () => {
        test("valida producto correcto", () => {
            const product: Product = {
                id: 1,
                title: "Product",
                price: 10,
                thumbnail: "img.jpg",
                stock: 10,
            };

            const result = validateCartItem(product, 5);

            expect(result.valid).toBe(true);
            expect(result.error).toBeNull();
        });

        test("rechaza producto null", () => {
            const result = validateCartItem(null, 1);

            expect(result.valid).toBe(false);
            expect(result.error).toBe("Invalid product");
        });

        test("rechaza producto undefined", () => {
            const result = validateCartItem(undefined, 1);

            expect(result.valid).toBe(false);
            expect(result.error).toBe("Invalid product");
        });

        test("rechaza cantidad cero", () => {
            const product: Product = {
                id: 1,
                title: "Product",
                price: 10,
                thumbnail: "img.jpg",
                stock: 10,
            };

            const result = validateCartItem(product, 0);

            expect(result.valid).toBe(false);
            expect(result.error).toBe("Quantity must be greater than 0");
        });

        test("rechaza cantidad negativa", () => {
            const product: Product = {
                id: 1,
                title: "Product",
                price: 10,
                thumbnail: "img.jpg",
                stock: 10,
            };

            const result = validateCartItem(product, -5);

            expect(result.valid).toBe(false);
            expect(result.error).toBe("Quantity must be greater than 0");
        });

        test("rechaza cantidad mayor al stock", () => {
            const product: Product = {
                id: 1,
                title: "Product",
                price: 10,
                thumbnail: "img.jpg",
                stock: 5,
            };

            const result = validateCartItem(product, 10);

            expect(result.valid).toBe(false);
            expect(result.error).toBe("Insufficient stock");
        });

        test("acepta cantidad igual al stock", () => {
            const product: Product = {
                id: 1,
                title: "Product",
                price: 10,
                thumbnail: "img.jpg",
                stock: 5,
            };

            const result = validateCartItem(product, 5);

            expect(result.valid).toBe(true);
            expect(result.error).toBeNull();
        });
    });
});
