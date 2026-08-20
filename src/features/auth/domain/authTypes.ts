/**
 * @file authTypes.ts
 * @description Definición de tipos y contratos para la autenticación de usuarios.
 * @architecture Domain Layer
 */

export type UserRole = "admin" | "buyer";

export interface IUserProfile {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface IAuthContextValue {
  user: IUserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}
