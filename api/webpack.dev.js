const merge = require('webpack-merge')
const common = require('./webpack.common')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  plugins: [new NodemonPlugin()]
})
