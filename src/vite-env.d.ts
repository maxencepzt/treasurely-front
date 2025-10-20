// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  // ajouter d'autres variables d'environnement commençant par VITE_ ici
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
