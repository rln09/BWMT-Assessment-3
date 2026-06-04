import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Library build for a self-mounting IIFE bundle that the static pages
// load via <script src="donate-widget/dist/donate-widget.iife.js"></script>.
// React + ReactDOM are bundled inline so the widget drops onto any page
// without a separate runtime — that's why this bundle is fairly chunky.
export default defineConfig({
  plugins: [react()],
  define: {
    // Library mode doesn't substitute NODE_ENV by default, which means
    // both react.development.js and react.production.min.js end up in
    // the bundle. Force the prod path so we only ship one.
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.jsx'),
      name: 'PantryDonateWidget',
      formats: ['iife'],
      fileName: () => 'donate-widget.iife.js'
    },
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        globals: {}
      }
    }
  }
});
