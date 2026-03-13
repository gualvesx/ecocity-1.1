
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Define any environment variables here if needed
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
