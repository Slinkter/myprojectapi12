/**
 * @file index.ts
 * @description Public API barrel para la feature de Usuarios y Gestión de Perfiles (FSD Architecture).
 * @architecture Feature Layer - Users Public API Barrel
 */

export * from "./domain/repositories/IUserRepository";
export * from "./infrastructure/usersFirestore";
export * from "./infrastructure/FirestoreUserRepository";
