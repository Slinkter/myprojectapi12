/**
 * @file discounts.ts
 * @description Configuración y tabla de códigos de descuento disponibles en la aplicación.
 * @architecture Feature Layer - Checkout Domain
 */

export interface IDiscount {
    type: "percent" | "fixed";
    value: number;
}

export const DISCOUNT_CODES: Record<string, IDiscount> = {
    WELCOME10: { type: "percent", value: 10 },
    SAVE5:     { type: "fixed",   value: 5 },
    VIP20:     { type: "percent", value: 20 },
};
