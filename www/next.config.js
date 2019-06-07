require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  webpack: config => {
    config.plugins.push(
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      })
    )

    return config
  }
})
