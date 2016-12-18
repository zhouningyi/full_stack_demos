/*
 * @Author: zhouningyi
 * @Date:   2016-10-01 14:18:17
 * @Last Modified by:   zhouningyi
 * @Last Modified time: 2016-12-03 23:56:33
 */
var path = require('path');
var config = require('./config')

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var ip = require('ip');

var src = path.resolve(__dirname, './');

var SFTP_CONFIG = {
  on: process.env.SFTP || false, // default false
  conf: {
    host: 'example.com',
    port: '22', // default
    username: 'username',
    password: 'password',
    from: '/path/to/localDistPath',
    to: '/path/to/serverPath',
  }
};

var vNodeModules = path.join(__dirname, 'node_modules');

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(src, config.path)
  ],
  resolveLoader: {
    fallback: [vNodeModules]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './min.js',
    publicPath: '/'
  },
  resolve: {
    fallback: [vNodeModules],
    extensions: ['', '.js', '.jsx'],
    alias: {
      // ================
      // 自定义路径名
      // ================
      CONTAINERS: path.join(src, 'containers'),
      COMPONENTS: path.join(src, 'components'),
      ACTIONS: path.join(src, 'actions'),
      REDUCERS: path.join(src, 'reducers'),
      STORE: path.join(src, 'store'),
      CONFIG: path.join(src, 'conf'),
      //
      ROUTES: path.join(src, 'routes'),
      SERVICES: path.join(src, 'services'),
      UTILS: path.join(src, 'utils'),
      HOC: path.join(src, 'utils/HoC'),
      MIXIN: path.join(src, 'utils/mixins'),
      VIEWS: path.join(src, 'views'),
    },
  },
  module: {
    root: vNodeModules,
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: [
          'babel-preset-es2015',
          'babel-preset-react',
          'babel-preset-stage-0',
          'babel-preset-stage-2',
        ].map(require.resolve),
      }
    }, {
      test: /\.scss$/,
      loader: 'style!css!postcss!sass'
    }, {
      test: /\.less$/,
      loader: 'style!css!postcss!less'
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url?limit=25000&name=[name].[ext]?[hash]'
    }, {
      test: /\.(eot|woff|ttf|svg)$/,
      loader: 'url?limit=30000&name=[name]-[hash].[ext]'
    }],
  },
  postcss: function() {
    return [autoprefixer, precss];
  },
  plugins: process.env.NODE_ENV === 'production' ? SFTP_CONFIG.on ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
  ] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
      chunkSortMode: 'none'
    }),
    new OpenBrowserPlugin({
      url: `http://${ip.address()}:8080`
    })
  ],
  devtool: process.env.NODE_ENV === 'production' ? '' : '#inline-source-map'
};