require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  webpack: config => {
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    )

    config.optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
        terserOptions: {
          mangle: false
        }
      })
    ]

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack'
        }
      ]
    })

    return config
  }
}
