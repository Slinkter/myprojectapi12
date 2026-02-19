/**
 * @file ProductModalContext.ts
 * @description Contexto para la gestión del estado del modal de producto.
 * @architecture Application Layer - Context
 */

import { createContext } from "react";
import { IUseProductModalResult } from "@/features/products/application/types";

/**
 * Contexto para el modal de producto.
 */
export const ProductModalContext = createContext<
  IUseProductModalResult | undefined
>(undefined);
