const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    library: 'Vue-Banana-i18n',
    libraryExport: 'default',
    libraryTarget: 'umd',
    filename: 'vue-banana-i18n.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map'
}
