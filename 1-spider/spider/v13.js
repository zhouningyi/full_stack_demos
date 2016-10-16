/*
  用PhantomJS 模拟登录，用图片展示登录成功了
  模拟登录其实和第一节课的抢月饼是一个原理 最重要的就是evaluate函数内的操作
*/



var webpage = require('webpage');
var page = webpage.create();



var agentPc = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36';
page.settings.userAgent = agentPc;

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

page.open('http://sh.lianjia.com/', function() {
	console.log('opened...', page);
	// page.clipRect = {top: 0, left: 0, width: width, height: height}; 
	page.render('./img/unlogin.png');
	page.evaluate(function() {//evaluate函数，相当于在网页的console里执行代码

		console.log('start login...');

		$('#loginUrl').click()
			//
		var cfg = {
			pwd: '12345678',
			usr: '18357138841'
		};

		var login = $('#con_login_user');
		login.find('#user_name')[0].value = cfg.usr;
		login.find('#user_password')[0].value = cfg.pwd;
		login.find('#login-user-btn').click();
	});

	//正在登录
	setTimeout(function() {//登录之中截屏一次
		console.log('login ing..');
		page.render('./img/login_ing.jpg');
	}, 500);
	//
	setTimeout(function() {//登录结束截屏一次，证明登录成功
		console.log('logined...');
		page.render('./img/logined.jpg');
	}, 3000);
});