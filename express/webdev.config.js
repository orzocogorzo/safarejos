const path = require('path');
const fs = require('fs');
const wpAPI = require('./webpack/webpack.config');
const user_config = require('../webdev.config');

const config = Object.assign({
	distDir: 'dist',
  srcDir: 'src',
  dataDir:'src/data',
  entry: "src/scripts/index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  envFile: './environments.js', 
  module: {
    rules: []
  },
  plugins: [],
  api: wpAPI
}, user_config);

module.exports = config;
