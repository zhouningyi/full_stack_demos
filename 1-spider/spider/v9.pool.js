/*
  pool的模型，和v8差不多
*/

var request = require('request');
var fs = require('fs');
//

var Mongo = require('./mongo');

var poolCount = 10;
var timeout = 100;

var parser = require('./v9.parser');

function Pool(urls){
  this.urls = urls;
  this.reset();
  this.init();
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
