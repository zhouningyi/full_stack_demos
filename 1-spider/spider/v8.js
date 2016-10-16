/*
  v8开始是一个新的内容
  我们之前是针对ajax请求进行爬取，这回是解析网页。
  在这个案例里，我们遇到了不能翻过100页的限制
  我们通过点击filter里面的按钮，比如查看黄浦区的所有小区去跳过这个限制
  这个就是生成所有可能的url
*/

var request = require('request');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var urlBase = 'http://sh.lianjia.com/';
var urlXiaoqu = urlBase + 'xiaoqu';

request.get(urlXiaoqu, function(e, res, body) {
  if (!e && res.statusCode == 200) {
    var $ = cheerio.load(body);//开始解析网页字符串
    var urls = findALLURL($);//发现所有的url
    console.log(urls);
    urls = genURLs(urls);//把每个url从第一页翻到100页
  }
});

function findALLURL($){
  var hrefs = [];
  var url;
  $('#filter-options').find('a').each(function(i, node){//寻找 id为filter-options的面板下所有的a标签内的url
    url = $(node).attr('href');
    url = path.join(urlBase, url);
    hrefs.push(url);
  });
  hrefs = filterUrl(hrefs);
  return hrefs;
}


function filterUrl(arr){//过滤url，我们发现我们要的url都有 /xiaoqu/的结构 
  var newArr = [];
  for(var i = 0; i < arr.length; i++){
    var url = arr[i];
    if(!url || url.indexOf('xiaoqu') === -1) continue;
    newArr.push(url);
  }
  return newArr;
}

function genURLs(arr){
  var newArr = [];
  var url, newUrl;
  for(var i = 0; i <= arr.length; i ++){
    url = arr[i];
    if(!url) continue;
    for(var j = 0; j < 101; j ++){
      newUrl = path.join(url, 'd' +  j);
      newArr.push(newUrl);
    }
  }
  return newArr;
}
