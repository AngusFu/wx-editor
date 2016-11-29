import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';

const conf = {
  entry: 'src/index.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  moduleName: "wxEditor",
  context: 'window',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: [ '.ts', '.js', '.json' ]
    }),
    commonjs(),
    json(),
    buble(),
    uglify({}, minify)
  ]
};

export default conf;
