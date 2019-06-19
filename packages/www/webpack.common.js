const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  entry: './server/index.js',
  externals: [nodeExternals()],
  output: {
    filename: 'server.js',
    path: __dirname + '/.next/dist'
  }
}
