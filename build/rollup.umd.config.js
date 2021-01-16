import { plugins } from './plugins';
import pkg from '../package.json';

export default {
  input: 'dist/bundles/vscroll-native.esm5.js',
  output: [
    {
      file: 'dist/bundles/' + pkg.name + '.umd.js',
      format: 'umd',
      name: 'VScrollNative',
      exports: 'named',
      amd: { id: 'vscroll-native' },
      sourcemap: true
    },
    {
      file: 'dist/bundles/' + pkg.name + '.umd.min.js',
      format: 'umd',
      name: 'VScrollNative',
      exports: 'named',
      amd: { id: 'vscroll-native' },
      sourcemap: true,
      plugins: [plugins.terser()]
    }
  ],
  plugins: [
    plugins.resolve(),
    plugins.sourcemaps(),
    plugins.license('UMD')
  ]
};
