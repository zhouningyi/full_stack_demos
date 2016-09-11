/*
  直接爬取并出现错误
*/
//
//

var request = require('request');
var fs = require('fs');
var getURLs = require('./v9.urls');
var Pool = require('./v9.pool');
var Mongo = require('./mongo');


getURLs(function(urls){
  new Pool(urls).query();
});
//
