// src/vite-env.d.ts
/// <reference types="vite/client" />

interface IImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly DEV: boolean;
  // Add other VITE_* environment variables as needed
}

interface IImportMeta {
  readonly env: IImportMetaEnv;
}
