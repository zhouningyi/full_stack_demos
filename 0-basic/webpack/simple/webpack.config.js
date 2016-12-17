var webpack = require('webpack');

module.exports = {
  entry: {
    index: './index.js'
  },
  //入口文件输出配置
  output: {
    path: 'dist/',
    filename: 'index.js'
  }
};