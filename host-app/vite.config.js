import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load .env variables
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "VITE_");

  const remoteUrl = env.VITE_REMOTE_APP_URL;
  const hostUrl = env.VITE_HOST;

  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: "host_app",
        remotes: {
          remote_app: `${remoteUrl}assets/remoteEntry.js`,
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
      port: 5000,
      host: hostUrl,
    },
  };
});
