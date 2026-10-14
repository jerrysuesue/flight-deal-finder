import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Plain client-side SPA: `vite build` emits static files to dist/.
// Deep links (/app, /sign-in, …) are served index.html by vercel.json rewrites.
export default defineConfig({
  plugins: [react(), tailwindcss(), tsConfigPaths()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
