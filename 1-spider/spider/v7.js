/*
  直接爬取并出现错误
*/
//用mongodb实现并行爬取
//
//

var Pool = require('./v7.pool');
var addresses = require('./data/community.json');

new Pool(addresses).query();


