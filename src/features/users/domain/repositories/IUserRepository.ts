/**
 * @file IUserRepository.ts
 * @description Interfaz de repositorio de dominio para la gestión y administración de usuarios.
 * @architecture Domain Layer - Repository Pattern Interface
 */

import type { IUserProfileDocument } from "@/features/users/infrastructure/usersFirestore";

/**
 * Contrato de repositorio para operaciones sobre perfiles y roles de usuario.
 */
export interface IUserRepository {
  /**
   * Obtiene la lista completa de perfiles de usuario registrados en la plataforma.
   */
  getAllUsers(): Promise<IUserProfileDocument[]>;

  /**
   * Modifica el estado de suspensión de una cuenta de usuario.
   */
  setUserSuspension(uid: string, isSuspended: boolean): Promise<void>;
}
