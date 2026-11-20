import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src/beautiful', import.meta.url)) } },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Vite runs on the client already. Keep the original React directives in source.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('"use client"')) return;
        warn(warning);
      },
    },
  },
});
