//最简单的爬虫 高德搜索接口，打印出数据并进行存储


var request = require('request');//request模块 为了发起http请求

var url = 'http://ditu.amap.com/service/poiInfo?query_type=TQUERY&pagesize=100&pagenum=1&cluster_state=4&city=330100&keywords=%E5%8C%BB%E9%99%A2';

var data, list, d, result;
request.get(url, function(e, res, body) {
  if (e) return console.log(e);//判断返回是否有问题
  if (!e && res.statusCode == 200) {//e.statusCode为状态码，也是评估返回是不是有问题
    body = JSON.parse(body);//返回的数据是字符串，需要转化为json格式
    data = body.data;
    list = data[0].list;//这几部可以从chrome的network里，先看看json的结构
    d = list[0];
    console.log('返回的数据是: \n\n', {
      city: d.cityname,
      name: d.name,
      lat: d.location.lat,
      lng: d.location.lng,
      tel: d.tel
    }, '\n\n');
  }
});
