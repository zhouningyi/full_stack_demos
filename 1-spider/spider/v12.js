/*
  用PhantomJS模拟登录，
  不同的user-agent实验，即，把phantomjs模拟成手机和pc去访问网站
  在这个案例里，网站端也分别给2种设备不同的页面
*/


var webpage = require('webpage');
var page = webpage.create();

var agentPc = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36';
var agentPhone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';


// var settings = 
page.settings.userAgent = agentPhone;

page.onResourceReceived = function(){
};

page.open('http://sh.lianjia.com/', function() {
	console.log('opened...');
	setTimeout(function(){page.render('test.png');}, 2000);
});