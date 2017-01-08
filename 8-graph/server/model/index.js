'use strict;'

var Sequelize = require('sequelize');
var options = {
  host: 'localhost',
  db: 'spider',
  usr: 'postgres',
  pwd: 'zhouningyi',
  port: 5432
};

module.exports = new Sequelize(options.db, options.usr, options.pwd, {
  host: options.host,
  port: options.port,
  maxConcurrentQueries: 100, //最大连接数
  dialect: 'postgres',
  pool: {
    maxConnections: 200,
    maxIdleTime: 30
  },
  logging: function () {
  }
});
