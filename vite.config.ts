import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: true,
        proxy: {
            // Proxy API requests to backend/serverless function if needed
            // Assuming current structure mostly client-side or using relative paths
        }
    },
    build: {
        outDir: 'build', // Maintain 'build' folder for compatibility with existing deploy scripts
    },
});
