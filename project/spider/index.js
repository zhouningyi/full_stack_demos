/*
  直接爬取并出现错误
*/
//用mongodb实现并行爬取
//
//

var Pool = require('./pool');
var addresses = require('./data/community.json').records;

new Pool(addresses).query();


