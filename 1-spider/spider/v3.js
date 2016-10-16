/*
 之前都是我们对一行数据的爬取，我们的问题是输入一列医院的名字，输出一列的医院信息
 医院的名字中，包含了城市信息，而getURL函数需要输入中国标准代码adcode，
 因此，我们去这个网站上下载 datav.aliyun.com/static/tools/atlas
 下载完了用城市名称的前两个字和adcode建立一个映射关系
 如 {
  '上海': 310000
 },
 为生成url用
*/


var request = require('request');
var fs = require('fs');
//
var cities = require('./data/cities.json');//输入的地理数据
var keywords = require('./data/input');//输入的文字

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


//获取爬取url的函数
function getURL(adcode, keyword) {
  return encodeURI('http://ditu.amap.com/service/poiInfo?query_type=TQUERY&pagesize=100&pagenum=1&cluster_state=4&city=' + adcode + '&keywords=' + keyword);
}

//
var data, list, d, obj, result = [];
var spiderIndex = 0, spiderSuccessIndex = 0;
var queryN = keywords.length;
function query(url) {
  request.get(url, function(e, res, body) {
    spiderIndex++;
    if (!e && res.statusCode == 200) {
      body = JSON.parse(body);
      data = body.data;
      if(!data || !data[0]) return;
      list = data[0].list;
      if(!list || !list[0]) return;
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
    } else {
      console.log('错误');
    }
  });
}

//我们现在存成文件，代码简短，后续有可能会变得复杂，所以抽出一个函数来
function save(ds){
  fs.writeFileSync('./data/output.json', JSON.stringify(ds, null, 2), 'utf8');
}

////////////////////////////////////////////////////////////////
///////////////////////////// 主入口 ////////////////////////////
////////////////////////////////////////////////////////////////


//
// 三月爬虫, 被注释掉的代码是最可怕的，一运行就因为爬取太快被高德封杀
// var str, adcode, url;
// keywords.forEach(function(keyword){
//   str = keyword.substring(0, 2);
//   adcode = adcodeMap[str];
//   if(!adcode) return;
//   url = getURL(adcode, keyword);
//   query(url);
// });

// timeout模式 是一种简单的方式，1s的时候请求，2s的时候请求，1000s的时候请求。
var timeInterval = 1000;
keywords.forEach(function(keyword, i){
  var str = keyword.substring(0, 2);
  var adcode = adcodeMap[str];
  if(!adcode) return;
  var url = getURL(adcode, keyword);
  var timeout = timeInterval * i;
  setTimeout(function(){
     query(url);
  }, timeout);
});



