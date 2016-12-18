/**
* @Author: eason
* @Date:   2016-09-05T18:16:21+08:00
* @Last modified by:   eason
* @Last modified time: 2016-09-06T14:02:15+08:00
*/


var path = require('path');

var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var px2rem = require('postcss-plugin-px2rem');
var ip = require('ip');
var SftpWebpackPlugin = require('sftp-webpack-plugin');

var src = path.resolve(__dirname, './src');
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

var PX2REM_OPTIONS = {
  rootValue: 16,
  unitPrecision: 5,
  propWhiteList: [],
  propBlackList: [],
  selectorBlackList: [],
  ignoreIdentifier: false,
  replace: true,
  mediaQuery: false,
  minPixelValue: 0,
};

module.exports = {
  entry: [
    'babel-polyfill',
    path.join(src, 'app.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './bundle.js',
    publicPath: '/'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules') // @TODO Doesnot work, for some packages will use local node_modules,
    // modulesDirectories: [ path.join(__dirname, 'node_modules') ] // for some packages will use local node_modules,
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
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
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy'
          ],
          presets: [
            'es2015',
            'react',
            'stage-0',
            'stage-2'
          ].map(e => 'babel-preset-'+e).map(require.resolve)
        }
      }, {
        test: /\.scss$/,
        loader: 'style!css?modules&localIdentName=[name]__[local]!postcss!sass'
      }, {
        test: /\.less$/,
        loader: 'style!css?modules&localIdentName=[name]__[local]!postcss!less'
      }, {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]__[local]!postcss'
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url?limit=25000&name=[path][name].[ext]?[hash]'
      }, {
        test: /\.(eot|woff|ttf|svg)$/,
        loader: 'url?limit=30000&name=[path][name]-[hash].[ext]'
      }
    ],
  },
  postcss: function () {
    return [ autoprefixer, precss, px2rem(PX2REM_OPTIONS) ];
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      chunkSortMode: 'none'
    }),
    new SftpWebpackPlugin(SFTP_CONFIG.conf)
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      chunkSortMode: 'none'
    }),
  ] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      chunkSortMode: 'none'
    }),
    new OpenBrowserPlugin({ url: `http://${ip.address()}:8080` })
  ],
  devtool: process.env.NODE_ENV === 'production' ? '' : '#inline-source-map'
};
