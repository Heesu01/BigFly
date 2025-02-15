import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, "/v1"),
      },
      // port: 3000,
    },
  },
});
