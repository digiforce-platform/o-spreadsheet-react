import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dts from 'rollup-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    lib: {
      entry: 'src/spreadsheet/index.ts',
      name: 'Spreadsheet',
      fileName: 'spreadsheet',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true
      }
    }
  },
})
