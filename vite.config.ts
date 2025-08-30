import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import type { UserConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Carrega as variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production';
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    // Define a base correta para produção
    base: isProduction ? '/' : '/',
    // Configuração para o Vite lidar com rotas do React Router
    server: {
      // Configuração removida que causava erro de tipagem
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'reset-password': resolve(__dirname, 'index.html'),
          'auth/callback': resolve(__dirname, 'index.html')
        }
      }
    }
  };
});
