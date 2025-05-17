import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/types/index.d.ts',
  output: [{ file: 'dist/spreadsheet.d.ts', format: 'es' }],
  plugins: [
    dts(),
    nodeResolve(),
  ],
  external: [/\.scss$/, /\.css$/]
};
