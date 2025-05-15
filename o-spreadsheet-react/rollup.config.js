import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

export default defineConfig({
  input: 'dist/types/index.d.ts',
  output: [
    { 
      file: 'dist/spreadsheet.d.ts',
      format: 'es',
      sourcemap: false
    }
  ],
  plugins: [dts()],
  external: [/\.css$/, /\.scss$/, /\.(png|jpg|jpeg|gif|svg)$/]
});
