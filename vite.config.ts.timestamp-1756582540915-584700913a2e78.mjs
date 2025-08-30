// vite.config.ts
import { defineConfig, loadEnv } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ["lucide-react"]
    },
    // Define a base correta para produção
    base: isProduction ? "/" : "/",
    // Configuração para o Vite lidar com rotas do React Router
    server: {
      // Configuração removida que causava erro de tipagem
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__vite_injected_original_dirname, "index.html"),
          "reset-password": resolve(__vite_injected_original_dirname, "index.html"),
          "auth/callback": resolve(__vite_injected_original_dirname, "index.html")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgdHlwZSB7IFVzZXJDb25maWcgfSBmcm9tICd2aXRlJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pOiBVc2VyQ29uZmlnID0+IHtcbiAgLy8gQ2FycmVnYSBhcyB2YXJpXHUwMEUxdmVpcyBkZSBhbWJpZW50ZVxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgY29uc3QgaXNQcm9kdWN0aW9uID0gZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgfHwgZW52LlZFUkNFTF9FTlYgPT09ICdwcm9kdWN0aW9uJztcbiAgXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgICB9LFxuICAgIC8vIERlZmluZSBhIGJhc2UgY29ycmV0YSBwYXJhIHByb2R1XHUwMEU3XHUwMEUzb1xuICAgIGJhc2U6IGlzUHJvZHVjdGlvbiA/ICcvJyA6ICcvJyxcbiAgICAvLyBDb25maWd1cmFcdTAwRTdcdTAwRTNvIHBhcmEgbyBWaXRlIGxpZGFyIGNvbSByb3RhcyBkbyBSZWFjdCBSb3V0ZXJcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIC8vIENvbmZpZ3VyYVx1MDBFN1x1MDBFM28gcmVtb3ZpZGEgcXVlIGNhdXNhdmEgZXJybyBkZSB0aXBhZ2VtXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICAgICdyZXNldC1wYXNzd29yZCc6IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICAgICdhdXRoL2NhbGxiYWNrJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLGNBQWMsZUFBZTtBQUMvUCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFrQjtBQUVwRCxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsUUFBTSxlQUFlLElBQUksYUFBYSxnQkFBZ0IsSUFBSSxlQUFlO0FBRXpFLFNBQU87QUFBQSxJQUNMLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxJQUNqQixjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsY0FBYztBQUFBLElBQzFCO0FBQUE7QUFBQSxJQUVBLE1BQU0sZUFBZSxNQUFNO0FBQUE7QUFBQSxJQUUzQixRQUFRO0FBQUE7QUFBQSxJQUVSO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxXQUFXO0FBQUEsTUFDWCxlQUFlO0FBQUEsUUFDYixPQUFPO0FBQUEsVUFDTCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFVBQ3JDLGtCQUFrQixRQUFRLGtDQUFXLFlBQVk7QUFBQSxVQUNqRCxpQkFBaUIsUUFBUSxrQ0FBVyxZQUFZO0FBQUEsUUFDbEQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
