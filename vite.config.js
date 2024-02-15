import { defineConfig } from 'vite';
import VitePluginString from 'vite-plugin-string';

export default defineConfig({
  base: "static",
  server: {
    proxy: {
      '/user_management': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/task_management': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  plugins: [
    VitePluginString({
      include: [
        '**/*.log',
      ]
    })
  ]
});
