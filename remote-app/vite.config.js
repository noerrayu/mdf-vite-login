import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env variables
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const hostURL = env.VITE_REMOTE;

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "remote_app",
        filename: "remoteEntry.js",
        exposes: {
          "./Button": "./src/components/Button",
          "./Header": "./src/components/Header",
        },
        shared: ["react", "react-dom"],
      }),
    ],
    build: {
      modulePreload: false,
      target: "esnext",
      minify: false,
      cssCodeSplit: false,
    },
    preview: {
      port: 5001,
      host: hostURL,
      strictPort: true,
      cors: true,
    },
  };
});
