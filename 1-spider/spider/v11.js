/*
最简单的PhantomJS 解析
*/


var webpage = require('webpage');

var page = webpage.create();

page.onResourceRequested = function(requestData, networkRequest) {
  console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
};

page.open('http://sh.lianjia.com/xiaoqu', function() {
  page.render('img/lianjia_xiaoqu.png');
  phantom.exit();
});
