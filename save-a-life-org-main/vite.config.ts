import { defineConfig, type UserConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const isDev = mode === 'development';
  const plugins: PluginOption[] = [
    react(),
    isDev && componentTagger(),
  ].filter(Boolean) as PluginOption[];

  return {
    server: {
      host: '0.0.0.0',
      port: 8080,
      strictPort: true,
      open: isDev,
    },
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    esbuild: {
      drop: isDev ? [] : ['console', 'debugger'],
    },
    build: {
      outDir: 'dist',
      sourcemap: isDev,
      minify: isDev ? false : 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
