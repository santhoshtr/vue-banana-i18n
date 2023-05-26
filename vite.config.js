const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
  test: {
    environment: 'jsdom'
  },
  build: {
    // generate manifest.json in outDir
    manifest: true,
    minify: 'esbuild',
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'vue-banana-i18n'
      // fileName not specified; it'll be vue-banana-i18n.mjs or vue-banana-i18n.umd.js
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'reactive', 'inject'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }

})
