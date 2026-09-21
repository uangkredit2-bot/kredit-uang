import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/**
 * Vitest configuration for the frontend suite.
 *
 * Mirrors the `@` and `declarations` aliases from `vite.config.js` so tests
 * import the same module graph the app does. The DOM environment is supplied by
 * the `test` script (`--environment jsdom`); this file only wires aliases and
 * the jest-dom matchers.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
    dedupe: ["@icp-sdk/core"],
  },
  test: {
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Pin the pool bounds explicitly. The container's environment can leave
    // tinypool with minThreads > maxThreads, which aborts the run before any
    // test is collected ("options.minThreads and options.maxThreads must not
    // conflict"). Explicit equal bounds make the pool deterministic.
    pool: "forks",
    poolOptions: {
      forks: {
        minForks: 1,
        maxForks: 1,
      },
    },
  },
});
