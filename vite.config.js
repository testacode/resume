import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // Only compress files bigger than 10kb
    }),
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
    }),
    visualizer({
      open: false, // Set to true to automatically open the bundle report
      gzipSize: true,
      brotliSize: true,
    }),
    ViteImageOptimizer({
      png: {
        quality: 80,
        progressive: true,
      },
      jpg: {
        quality: 80,
        progressive: true,
      },
      jpeg: {
        quality: 80,
        progressive: true,
      },
      gif: {
        interlaced: true,
      },
    }),
  ],
  build: {
    minify: "terser",
    cssMinify: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create specific vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("posthog-js")) {
              return "vendor-analytics";
            }
            if (id.includes("react-icons")) {
              return "vendor-icons";
            }
            return "vendor-other";
          }
          // Split application code
          if (id.includes("src/components/")) {
            return "components";
          }
          if (id.includes("src/pages/")) {
            return "pages";
          }
        },
        // Optimize asset handling
        assets: {
          // Inline small images as base64
          inlineLimit: 8192, // 8kb
        },
      },
    },
    chunkSizeWarningLimit: 500,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Enable source maps for debugging
    sourcemap: mode === "development",
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-icons"],
    // New in Vite 5.0+ for better cold starts
    holdUntilCrawlEnd: false,
  },
  server: {
    // Enable HMR with overlay
    hmr: {
      overlay: true,
    },
    // Optimize for faster updates
    watch: {
      usePolling: false,
    },
  },
}));
