const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
      main: './src/index.js',
  },
  output: {
    filename: '[name].js',
    //path: path.resolve('dist'),
  },
  module: {
      rules:[
          {
              test:/\.css/,
              use:[
                  'style-loader', 
                  'css-loader' // resolves @import, urls, etc within css-files
              ]
          }
      ]
  },
  plugins:[
    new CleanWebpackPlugin(),// executed first?
    new HtmlWebpackPlugin({title: 'Output Management'})
  ]
};