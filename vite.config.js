import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy":
        "frame-ancestors 'self' https://open.spotify.com",
    },
  },
  plugins: [react()],
});
