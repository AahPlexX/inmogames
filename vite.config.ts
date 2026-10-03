import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/inmogames/',
  plugins: [react()],
  build: { sourcemap: false },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
