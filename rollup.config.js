import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'

export default [
  {
    input: 'src/index.js',
    output: {
      name: 'default',
      file: pkg.main,
      format: 'umd'
    },
    external: [
      'vue',
      'banana-i18n'
    ],
    plugins: [
      resolve(),
      commonjs(),
      esbuild({
        sourceMap: true,
        minify: true
      })
    ]
  }
]
