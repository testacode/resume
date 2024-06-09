import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    APP_URL: JSON.stringify(process.env.npm_package_homepage),
  },
});
