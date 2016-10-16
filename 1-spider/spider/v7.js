/*
  这个案例实现2点，一个是代码大了需要分不同的文件写代码，一个是线程池。
  线程池的介绍在V7.pool.js里
*/

var Pool = require('./v7.pool');
var addresses = require('./data/community.json');

new Pool(addresses).query();


