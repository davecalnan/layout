const path = require('path')
require('dotenv').config()
const Dotenv = require('dotenv-webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  entry: './src/index.js',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  plugins: [
    new Dotenv({
      path: path.join(__dirname, '.env'),
      systemvars: true
    })
  ],
  output: {
    filename: 'main.js'
  }
}
