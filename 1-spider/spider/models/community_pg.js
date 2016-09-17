'use strict';

var Sequelize = require('sequelize');

module.exports = {
  'name': 'house_lianjia_community_spider',
  'columns': {
    'community_name': Sequelize.STRING,
    'site': {
      'type': Sequelize.STRING,
      'comment': '板块（全称）'
    },
    'plate_id': {
      'type': Sequelize.STRING,
      'index': true,
      'comment': '板块id'
    },
    'plate': {
      'type': Sequelize.STRING,
      'comment': '板块'
    },
    'address': {
      'type': Sequelize.ARRAY(Sequelize.STRING),
      'comment': '具体的路段地址'
    },
    'gaode_newtype': {
      'type': Sequelize.STRING,
      'comment': '高德地图的类型id'
    },
    //
    'community_complete_year': {
      'type': Sequelize.INTEGER,
      'comment': '完成时间'
    },
    'age': {
      'type': Sequelize.INTEGER,
      'comment': '建成年数'
    },
    'community_url': {
      'type': Sequelize.STRING,
      'comment': '小区网址（pc）'
    },
    community_url_mobile:{
      'type': Sequelize.STRING,
      'comment': '小区网址（mobile）'
    },
    'community_id': {
      'type': Sequelize.STRING,
      'allowNull': false,
      'unique': true,
      'comment': '交易id'
    },
    //
    'building_density': {
      'type': Sequelize.FLOAT,
      'comment': '容积率'
    },
    'building_type': {
      'type': Sequelize.STRING,
      'comment': '建筑类型 如 板楼/塔板结合'
    },
    'house_count': {
      'type': Sequelize.INTEGER,
      'comment': '建筑户数'
    },
    'building_count': {
      'type': Sequelize.INTEGER,
      'comment': '建筑总量'
    },
    'green_rate': {
      'type': Sequelize.FLOAT,
      'comment': '绿化率'
    },
    'avr_price': Sequelize.FLOAT,
    'manage_company': {
      'type': Sequelize.STRING,
      'comment': '物业公司'
    },
    'develop_company': {
      'type': Sequelize.STRING,
      'comment': '地产公司'
    },
    lat: {
      'type': Sequelize.FLOAT,
      'comment': 'lat'
    },
    lng: {
      'type': Sequelize.FLOAT,
      'comment': 'lng'
    },
    city_adcode:{
      'type': Sequelize.STRING,
      'comment': '城市地理编码'
    },
    district_adcode:{
      'type': Sequelize.STRING,
      'comment': '地区地理编码'
    },
    growth:{
      'type': Sequelize.FLOAT,
      'comment': '近一年增长'
    }
  }
};
