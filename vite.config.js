import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = env.VITE_BASE_PATH || "/telegram_react/";
  const extraAllowedHosts = (env.VITE_ALLOWED_HOSTS || "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);

  return {
    base,
    plugins: [react()],

    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      allowedHosts: ["tricky-corners-sit.loca.lt", ...extraAllowedHosts],
      hmr: {
        clientPort: 443,
      },
    },

    preview: {
      host: "0.0.0.0",
      port: 4173,
      allowedHosts: ["tricky-corners-sit.loca.lt", ...extraAllowedHosts],
    },
  };
});
