/*
PhantomJS相当于在nodejs里跑了个浏览器
我们先安装， npm install phantomjs -g （有时候sudo npm install phantomjs -g）
运行时候记得是 phantomjs v11.js， 不是node v11.js
最简单的PhantomJS解析一个页面后保存成图片
*/


var webpage = require('webpage');

var page = webpage.create();

page.onResourceRequested = function(requestData, networkRequest) {//一个资源载入后，就触发这个函数
  console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
};
page.onConsoleMessage = function(e, d){
	console.log(e, d)
}
page.open('http://sh.lianjia.com/xiaoqu', function() {
	page.evaluate(function() {//evaluate函数，相当于在网页的console里执行代码
		console.log(navigator.plugins.length)
	});
  // phantom.exit();//退出
});
