/*
  直接爬取并出现错误
*/
//用mongodb实现并行爬取
//
//

var request = require('request');
var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');

var urlBase = 'http://sh.lianjia.com/';
var urlXiaoqu = urlBase + 'xiaoqu';

request.get(urlXiaoqu, function(e, res, body) {
  if (!e && res.statusCode == 200) {
    var $ = cheerio.load(body);
    var urls = findALLURL($);
    console.log(urls);
    urls = genURLs(urls);
  }
});

function findALLURL($){
  var hrefs = [];
  var url;
  $('#filter-options').find('a').each(function(i, node){
    url = $(node).attr('href');
    url = path.join(urlBase, url);
    hrefs.push(url);
  });
  hrefs = filterUrl(hrefs);
  return hrefs;
}


function filterUrl(arr){
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
