/*
  这个案例开始，我们有一个新的方法去减慢爬取的速度，我们让爬虫排队
  逻辑主要在query函数里，query函数可以自己调用自己，通过这个方法去进行串行执行，当爬完的时候自动退出
  query函数的done函数不重要，只是在所有任务完成的时候进行退出，你把done函数去掉，这个程序也可以正常执行
*/

var request = require('request');
var fs = require('fs');
//
var cities = require('./data/cities');
var keywords = require('./data/input');

//生成城市名和adcode的列表
var adcodeMap = {};
cities
  .filter(function(d) {
    return d.level === 'city';
  })
  .forEach(function(d) {
    var str = d.name.substring(0, 2);
    adcodeMap[str] = d.adcode;
  });

//获取url的函数
function getURL(keyword) {
  str = keyword.substring(0, 2);
  adcode = adcodeMap[str];
  if (!adcode) return;
  return encodeURI('http://ditu.amap.com/service/poiInfo?query_type=TQUERY&pagesize=100&pagenum=1&cluster_state=4&city=' + adcode + '&keywords=' + keyword);
}

//
var data, list, d, obj, result = [];
var spiderIndex = 0, spiderSuccessIndex = 0;
var queryN = keywords.length;
function query(done) {
  var keyword = keywords[spiderIndex];
  var url = getURL(keyword);
  spiderIndex++;
  if(spiderIndex >= queryN) return done();
  request.get(url, function(e, res, body) {
    if (!e && res.statusCode == 200) {
      body = JSON.parse(body);
      data = body.data;
      if(!data || !data[0]) return query(done);
      list = data[0].list;
      if(!list || !list[0]) return query(done);
      //
      d = list[0];
      obj = {
        city: d.cityname,
        name: d.name,
        lat: d.location.lat,
        lng: d.location.lng,
        tel: d.tel
      };
      //
      spiderSuccessIndex++;
      console.log(spiderSuccessIndex + '/' + spiderIndex + '|' + queryN);
      result.push(obj);
      save(result);
      return query(done);
    } else {
      console.log('错误');
      return query(done);
    }
  });
}


function save(ds){
  fs.writeFileSync('./data/output.json', JSON.stringify(ds, null, 2), 'utf8');
}

////////////////////////////////////////////////////////////////
///////////////////////////// 主入口 ////////////////////////////
////////////////////////////////////////////////////////////////
query(function(){
  console.log('大功告成..');
  process.exit();
});



