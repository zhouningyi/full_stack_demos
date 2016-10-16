/*
  用PhantomJS 实现登录后记录cookie
*/


var webpage = require('webpage');
var page = webpage.create();
var fs = require('fs');

var agentPc = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36';
page.settings.userAgent = agentPc;

page.onConsoleMessage = function(msg) {
	console.log(msg);
};


function login(){
	page.evaluate(function() {
		console.log('start login...');
		$('#loginUrl').click()
			//
		var cfg = {
			pwd: '87654321',
			usr: '13907918271'
		};

		var login = $('#con_login_user');
		login.find('#user_name')[0].value = cfg.usr;
		login.find('#user_password')[0].value = cfg.pwd;
		login.find('#login-user-btn').click();
	});
}

function save(name, info){
	info = JSON.stringify(info);
	fs.write(name, info, 'w');
}

page.open('http://sh.lianjia.com/', function() {
	login();
	setTimeout(function() {
		console.log('save cookie..');
		save('cookie.txt', page.cookies);
	}, 500);
});