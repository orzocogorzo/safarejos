const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
	distDir: path.resolve(__dirname, 'dist'),
  	srcDir: path.resolve(__dirname, 'src'),
  	dataDir: path.resolve(__dirname, 'src/data'),
  	entry: path.resolve(__dirname, "src/scripts/index.js"),
  	output: {
    		path: path.resolve(__dirname, 'dist'),
    		filename: 'main.js'
  	},
    envFile: path.resolve(__dirname, 'environments.js'),
    plugins: [
      new CleanWebpackPlugin(path.resolve(__dirname, 'dist/'), { 
        root: path.resolve(__dirname),
        exclude: ['environment.js']
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        minify: true,
        hash: true,
        cache: true
      })
    ]
}

module.exports = config;
