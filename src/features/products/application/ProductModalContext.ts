/**
 * @file ProductModalContext.ts
 * @description Contexto para la gestión del estado del modal de producto.
 * @architecture Application Layer - Context
 */

import { createContext } from "react";
import { IUseProductModalResult } from "@/features/products/application/types";

/**
 * Contexto de React para compartir el estado del modal de producto.
 *
 * @remarks
 * Se crea con un valor por defecto `undefined`.
 * El tipado `IUseProductModalResult | undefined` fuerza al consumidor
 * a verificar que el contexto esté disponible (ver useProductModalContext).
 *
 * @see IUseProductModalResult - Tipo del valor del contexto.
 * @see ProductModalProvider - Proveedor que inicializa el contexto.
 * @see useProductModalContext - Hook consumidor con validación.
 */
export const ProductModalContext = createContext<
  IUseProductModalResult | undefined
>(undefined);
