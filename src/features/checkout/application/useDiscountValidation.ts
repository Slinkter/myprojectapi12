/**
 * @file useDiscountValidation.ts
 * @description Hook para la validación y aplicación de códigos de descuento en el checkout.
 * @architecture Capa de Aplicación - Lógica de Descuentos
 */

import { useState, useCallback } from "react";
import { DISCOUNT_CODES, IDiscount } from "@/features/checkout/domain/discounts";

/**
 * Expresión regular constante para eliminar espacios en blanco de códigos de cupón.
 * Elevada a nivel de módulo para evitar instanciaciones repetitivas (js-hoist-regexp).
 */
export const WHITESPACE_REGEX = /\s+/g;

/**
 * Expresión regular constante para validar formato general de código de cupón alfanumérico.
 */
export const COUPON_CODE_REGEX = /^[A-Z0-9_-]+$/;

/**
 * @interface IDiscountCode
 * @description Representa un código de descuento válido con su tipo y valor.
 */
export interface IDiscountCode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
}

/**
 * Lista de códigos de descuento válidos construida dinámicamente desde el dominio.
 */
const VALID_CODES: IDiscountCode[] = Object.entries(DISCOUNT_CODES).map(
  ([code, item]: [string, IDiscount]) => ({
    code,
    discount: item.value,
    type: item.type === "percent" ? "percentage" : "fixed",
  }),
);

/**
 * Mapa indexado por código en mayúsculas para búsqueda de cupones en O(1) (js-set-map-lookups).
 */
const VALID_CODES_MAP = new Map<string, IDiscountCode>(
  VALID_CODES.map((item) => [item.code.toUpperCase(), item]),
);

/**
 * @interface UseDiscountValidationReturn
 * @description Retorno del hook useDiscountValidation.
 */
interface UseDiscountValidationReturn {
  code: string;
  setCode: (code: string) => void;
  appliedDiscount: IDiscountCode | null;
  error: string;
  isApplying: boolean;
  applyDiscount: () => void;
  removeDiscount: () => void;
}

/**
 * Hook que gestiona la validación, aplicación y eliminación de códigos de descuento.
 * Simula una validación asíncrona contra una lista de códigos predefinidos.
 *
 * @returns {UseDiscountValidationReturn} Estado y funciones para gestionar descuentos.
 */
export function useDiscountValidation(): UseDiscountValidationReturn {
  const [code, setCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<IDiscountCode | null>(null);
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const applyDiscount = useCallback(() => {
    const cleanCode = code.replace(WHITESPACE_REGEX, "").toUpperCase();
    if (!cleanCode) return;

    setIsApplying(true);
    setError("");

    setTimeout(() => {
      const found = VALID_CODES_MAP.get(cleanCode);

      if (found) {
        setAppliedDiscount(found);
        setCode("");
      } else {
        setError("Código de descuento inválido");
      }
      setIsApplying(false);
    }, 500);
  }, [code]);

  const removeDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setError("");
  }, []);

  return {
    code,
    setCode,
    appliedDiscount,
    error,
    isApplying,
    applyDiscount,
    removeDiscount,
  };
}

/**
 * Calcula el monto del descuento aplicado sobre el precio total.
 * Soporta descuentos porcentuales y montos fijos.
 *
 * @param {IDiscountCode | null} appliedDiscount - Código de descuento aplicado o null.
 * @param {number} totalPrice - Precio total antes del descuento.
 * @returns {number} Monto del descuento calculado.
 */
export function calculateDiscountAmount(
  appliedDiscount: IDiscountCode | null,
  totalPrice: number,
): number {
  if (!appliedDiscount || totalPrice <= 0) return 0;

  return appliedDiscount.type === "percentage"
    ? (totalPrice * appliedDiscount.discount) / 100
    : Math.min(appliedDiscount.discount, totalPrice);
}

