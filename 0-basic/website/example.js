//////
///ES5
//////

//变量
var i = 0;
i = 1;

//函数
function test(a){
	return 2 * a;
}

//循环
var list = [11,12,13,14];
for(var j = 0; j < list.length; j++){
	console.log(list[j])
}


[11,12,13,14].forEach(function(d, i){
	console.log(d)
});



//////
///ES6
//////

//变量
const i = 0;
i =1;//会报错

const obj = {}
obj.k = 10;

let j = 0; 
for(j = 0; j < 10; j++){
	console.log(j)
}

const ls = [ 'a', 'b', 'c' ];
for (v of ls) {
    console.log(v);//输出 a,b,c
}

const a = 1, b = 2
const cii = {a, b}


//函数
const test = (a) => 2 * a;
