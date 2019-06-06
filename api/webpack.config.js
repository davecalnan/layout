module.exports = {
  mode: 'production',
  target: 'node',
  entry: ['@babel/polyfill', './src/index.js'],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-transform-react-jsx',
              // '@babel/plugin-syntax-dynamic-import'
            ]
          }
        }
      }
    ]
  },
  output: {
    filename: 'main.js'
  }
}
