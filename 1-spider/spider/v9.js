/*
 v9比较复杂，把v8变成了一个模块，
*/

var request = require('request');
var fs = require('fs');
var getURLs = require('./v9.urls');//v8变成了一个模块
var Pool = require('./v9.pool');


getURLs(function(urls){
  new Pool(urls).query();
});
//
