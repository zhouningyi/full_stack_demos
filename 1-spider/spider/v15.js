/*
  用代理去访问网站
  代理可以去一些免费的代理网站找
*/

var request = require('request');

var proxy = {
	port: '80',
	host: '111.13.136.46',
};

var url = 'http://ditu.amap.com/service/poiInfo?query_type=TQUERY&pagesize=100&pagenum=1&cluster_state=4&city=330100&keywords=%E5%8C%BB%E9%99%A2';

var data, list, d, result;
var proxy = `http://${proxy.host}:${proxy.port}`;//es6的字符串模板
console.log(`使用代理 ${proxy} 访问网站`);

request
.defaults({
	proxy: proxy
})
.get(url, function(e, res, body) {
	if(e) console.log(e);
  if (!e && res.statusCode == 200) {
    body = JSON.parse(body);
    data = body.data;
    list = data[0].list;
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


