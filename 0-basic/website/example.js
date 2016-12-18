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
for(var j = 0; j < 10; j++){
	console.log(j)
}

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


//函数
const test = (a) => 2 * a;
