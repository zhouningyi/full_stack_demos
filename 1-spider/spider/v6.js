/*
  从这个案例开始，我们换了一个接口开始爬取
  我们的接口名称叫GeoCoding，遇到地址数据可以转化为经纬度

  我们的数据是小区的名称，需要的结果是清洗成经纬度
  之前的问题是爬取的太快会封杀，现在的问题是按照上一次的逻辑爬取太慢, 改进的方法在下一个案例
*/

var request = require('request');
var fs = require('fs');
//
var addresses = require('./data/community.json');
var Mongo = require('./mongo');

//获取url的函数
function getURL(address) {//GeoCoding，遇到地址可以转化为经纬度
  return encodeURI('http://restapi.amap.com/v3/geocode/geo?key=46799a1920f8b8914ad7d0a2db0096d1&address=' + address);
}

function update(obj) {
  Mongo.community.findOneAndUpdate({
    community_id: obj.community_id
  }, obj, {
    upsert: true
  }, function(e, d) {
    console.log('更新成功...');
  });
}

//
var data,  d, obj, result = [];
var spiderIndex = 0, spiderSuccessIndex = 0;
var queryN = addresses.length;
function query(next) {
  var obj = addresses[spiderIndex];
  var url = getURL(obj.address);
  spiderIndex++;
  if(spiderIndex >= queryN) return next();
  request.get(url, function(e, res, body) {
    if (!e && res.statusCode == 200) {
      body = JSON.parse(body);
      data = body.geocodes;
      if(!data || !data[0]) return nextQuery(next);
      d = data[0];
      var location = d.location;
      if(!d.location) return;
      location = location.split(',');
      obj.lat = parseFloat(location[1], 10);
      obj.lng = parseFloat(location[0], 10);
      //
      spiderSuccessIndex++;
      console.log(spiderSuccessIndex + '/' + spiderIndex + '|' + queryN);
      update(obj);
      return nextQuery(next);
    } else {
      console.log('错误');
      return nextQuery(next);
    }
  });
}

var timeout = 0;
function nextQuery(next){
  setTimeout(function(){
    query(next);
  }, timeout);
}

////////////////////////////////////////////////////////////////
///////////////////////////// 主入口 ////////////////////////////
////////////////////////////////////////////////////////////////
query(function(){
  console.log('大功告成..');
  process.exit();
});



