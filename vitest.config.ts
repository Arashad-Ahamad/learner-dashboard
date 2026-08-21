import { defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";

// Separate from vite.config.ts so `vite build` never picks up test-only
// config, and so `test` types don't need to be added to the app's tsconfig.
export default mergeConfig(
  defineConfig({ plugins: [react()] }),
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"],
      globals: true,
      css: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        exclude: ["src/main.tsx", "src/**/*.stories.tsx", ".storybook/**"],
      },
    },
  }),
);
