import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/inmogames/',
  plugins: [react()],
  build: { sourcemap: false },
  test: {
    environment: 'node',
    // .test.tsx files render React components and opt into a DOM with `// @vitest-environment happy-dom`.
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      // Mergrove only: its engine and UI logic are the code this gate protects. Thresholds ratchet upward and sit
      // a few points under the measured values (stmts 95.5, branches 92.0, funcs 97.8, lines 96.6 on 2026-10-07).
      include: ['src/games/mergrove/**/*.{ts,tsx}'],
      exclude: ['src/games/mergrove/mergrove.meta.ts', 'src/games/mergrove/sprites.tsx'],
      reporter: ['text-summary'],
      thresholds: { statements: 92, branches: 88, functions: 94, lines: 93 },
    },
  },
});
