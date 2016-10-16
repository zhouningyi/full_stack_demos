/*
  v10的内容和v9比，内容差不多，无非是数据库换成了postgres
*/

var request = require('request');
var fs = require('fs');
var getURLs = require('./v9.urls');
var Pool = require('./v10.pool');


getURLs(function(urls){
  new Pool(urls).query();
});
//
