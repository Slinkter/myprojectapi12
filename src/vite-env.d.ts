// src/vite-env.d.ts
/// <reference types="vite/client" />

/** Interfaz que define las variables de entorno personalizadas de Vite. */
interface IImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly DEV: boolean;
  // Add other VITE_* environment variables as needed
}

/** Interfaz que extiende ImportMeta con las variables de entorno tipadas. */
interface IImportMeta {
  readonly env: IImportMetaEnv;
}
