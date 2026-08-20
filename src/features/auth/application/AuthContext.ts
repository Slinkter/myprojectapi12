/**
 * @file AuthContext.ts
 * @description Definición de Context y hook useAuth para el estado de autenticación.
 * @architecture Application Layer
 */

import { createContext, useContext } from "react";
import type { IAuthContextValue } from "../domain/authTypes";

export const AuthContext = createContext<IAuthContextValue | undefined>(undefined);

/**
 * Hook personalizado para acceder al estado y métodos de autenticación.
 */
export const useAuth = (): IAuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
