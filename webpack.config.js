/**
 * Created by leefsmp on 4/6/15.
 */
var path = require('path');

module.exports = {

  entry: "./www/js/app.js",

  output: {
    path: path.join(__dirname, '/www/build'),
    filename: "bundle.js"
  },

  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" }
    ]
  },

  resolve: {
    // enables require('file') instead of require('file.ext')
    extensions: ['', '.js', '.json', '.css']
  },

  plugins: []
};