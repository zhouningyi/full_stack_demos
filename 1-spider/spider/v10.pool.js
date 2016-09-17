/*
  直接爬取并出现错误
*/
//用postgres实现并行爬取
//
//

var request = require('request');
var fs = require('fs');
//

var Pg = require('./pg');

var poolCount = 10;
var timeout = 100;

var parser = require('./v10.parser');

function Pool(urls){
  this.urls = urls;
  this.reset();
  this.init();
}

//获取url的函数
function getURL(address) {
  return encodeURI('http://restapi.amap.com/v3/geocode/geo?key=46799a1920f8b8914ad7d0a2db0096d1&address=' + address);
}

Pool.prototype = {
  reset: function(){
    this.spiderIndex = 0;
    this.queryingIndex = 0;
  },
  init: function(){
    this.querying = [];
  },
  process: function(e, res, body){
    if (!e && res.statusCode == 200) {
      parser(e, res, body);
    }
  },
  onProcessed: function(){
    this.queryingIndex--;
    setTimeout(function(){
      this.query();
    }.bind(this), timeout);
  },
  query: function(){
    if (this.queryingIndex > poolCount) return;
    var url = this.urls[this.spiderIndex];
    request.get(url, function(e, res, body){
      this.process(e, res, body);
    }.bind(this));
    this.spiderIndex = this.spiderIndex + 1;
    this.queryingIndex = this.queryingIndex + 1;
    if(this.queryingIndex < poolCount) this.query();
  }
};

module.exports = Pool;
