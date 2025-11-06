// src/vite-env.d.ts
/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_API_BASE_URL?: string;
  // ajouter d'autres variables d'environnement commençant par VITE_ ici
}

type ImportMeta = {
  readonly env: ImportMetaEnv;
}
