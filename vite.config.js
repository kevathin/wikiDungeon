import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                background: 'src/backend/background.js',
                popup: 'src/backend/popup.js'
            },
            output: {
                entryFileNames: '[name].js',
                format: 'es'
            }
        },
        minify: false
    }
});