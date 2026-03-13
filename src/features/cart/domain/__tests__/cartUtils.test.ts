/**
 * @file cartUtils.test.ts
 * @description Tests para las utilidades del carrito (domain layer).
 * Usa makeProduct / makeCartItem factory para evitar fixtures manuales incompletos.
 */
import { describe, test, expect } from "vitest";
import {
  calculateTotal,
  addItemToCart,
  removeItemFromCart,
  validateCartItem,
} from "@/features/cart/domain/cartUtils";
import { makeProduct, makeCartItem } from "@/test/factories/productFactory";

describe("cartUtils", () => {
  describe("calculateTotal", () => {
    test("calcula el total correctamente", () => {
      const cart = [
        makeCartItem({ id: 1, price: 10, quantity: 2 }),
        makeCartItem({ id: 2, price: 5, quantity: 3 }),
      ];
      expect(calculateTotal(cart)).toBe(35); // (10*2) + (5*3)
    });

    test("retorna 0 para carrito vacío", () => {
      expect(calculateTotal([])).toBe(0);
    });

    test("maneja decimales correctamente", () => {
      const cart = [makeCartItem({ price: 9.99, quantity: 3 })];
      expect(calculateTotal(cart)).toBeCloseTo(29.97, 2);
    });
  });

  describe("addItemToCart", () => {
    test("agrega nuevo producto al carrito vacío", () => {
      const cart = [] as ReturnType<typeof makeCartItem>[];
      const product = makeProduct({ id: 1, price: 10 });
      const result = addItemToCart(cart, product, 1);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ ...product, quantity: 1 });
    });

    test("incrementa cantidad si producto ya existe", () => {
      const product = makeProduct({ id: 1, price: 10 });
      const cart = [makeCartItem({ id: 1, price: 10, quantity: 2 })];
      const result = addItemToCart(cart, product, 3);
      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(5); // 2 + 3
    });

    test("agrega nuevo producto sin afectar existentes", () => {
      const cart = [makeCartItem({ id: 1, price: 10, quantity: 1 })];
      const product = makeProduct({ id: 2, price: 20 });
      const result = addItemToCart(cart, product, 1);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe("removeItemFromCart", () => {
    test("elimina producto del carrito", () => {
      const cart = [
        makeCartItem({ id: 1, quantity: 1 }),
        makeCartItem({ id: 2, quantity: 1 }),
      ];
      const result = removeItemFromCart(cart, 1);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    test("retorna carrito vacío si se elimina el único producto", () => {
      const cart = [makeCartItem({ id: 1, quantity: 1 })];
      const result = removeItemFromCart(cart, 1);
      expect(result).toHaveLength(0);
    });

    test("no afecta el carrito si el ID no existe", () => {
      const cart = [makeCartItem({ id: 1, quantity: 1 })];
      const result = removeItemFromCart(cart, 999);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe("validateCartItem", () => {
    test("valida producto correcto", () => {
      const product = makeProduct({ stock: 10 });
      const result = validateCartItem(product, 5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    test("rechaza producto null", () => {
      const result = validateCartItem(null, 1);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Producto inválido");
    });

    test("rechaza producto undefined", () => {
      const result = validateCartItem(undefined, 1);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Producto inválido");
    });

    test("rechaza cantidad cero", () => {
      const product = makeProduct({ stock: 10 });
      const result = validateCartItem(product, 0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("La cantidad debe ser mayor a 0");
    });

    test("rechaza cantidad negativa", () => {
      const product = makeProduct({ stock: 10 });
      const result = validateCartItem(product, -5);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("La cantidad debe ser mayor a 0");
    });

    test("rechaza cantidad mayor al stock", () => {
      const product = makeProduct({ stock: 5 });
      const result = validateCartItem(product, 10);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Stock insuficiente");
    });

    test("acepta cantidad igual al stock", () => {
      const product = makeProduct({ stock: 5 });
      const result = validateCartItem(product, 5);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});
