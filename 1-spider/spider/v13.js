/*
  用PhantomJS 实现页面解析
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
	page.evaluate(function() {

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
	setTimeout(function() {
		console.log('login ing..');
		page.render('./img/login_ing.jpg');
	}, 500);
	//
	setTimeout(function() {
		console.log('logined...');
		page.render('./img/logined.jpg');
	}, 3000);
});