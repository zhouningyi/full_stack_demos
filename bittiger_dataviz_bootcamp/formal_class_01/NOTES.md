### 上节课的链路：
获取数据：
- 公开数据
- 自有数据
- 爬虫

存储／清洗
- janity work

分析数据：
- 机器学习
- 统计分析

展示数据：
- 数据新闻
- 数据产品
- 数据大屏
- 数据分析


数据可视化：多用web
html5  这两年一直往上走，flash就衰落了
processing 过于简单 插件

server side 服务端（后端） + 客户端（前端） client side
客户端有很多中可能 ipad 手机 chrome，safari...
展示数据是前端的工作
但是数据可视化不能脱离后端

前段与后端 通过
http协议进行通讯 通过协议交换数据
或者https 更安全，不会被截包，不会被人分析
https 和http 是 前段发送请求 比较被动

或者web socket 做长链接
但是 web socket可以从后端主动发东西，



### 后端技术：
- 数据库： mysql mongodb postgres

内存与硬盘：memory 和 hard disk

- 中间层： node.js php java
如果没有中间层是不能跟前段通信的。前端发送请求时，中间层判断和处理。

php比较古老的技术，比较成熟。
node比较新，性能也比较好，对等php快三倍。
java就是出错概率较小，一般用java的时候就是需要项目很稳定。

- 前段技术：
html css javascript

### chrome浏览器
看chrome可以分析网页（dev tool）

Network
当刷新页面时，network体现所有网络请求。
XHR： AJAX请求。

Elements
就是dom结构。
可以更改css
### react 的virtual DOM ： 字符串检查， 达到更高效率。
react只是负责画？ 性能高。

### html dom
div 包含背景与内容。块结构。
早期的网页都写在一起。现在都是css和html分开的。

### 爬数据
查字段

### js
全局变量：document
ex： 在console里
```js
var a = document.getElementsbyTagName('a')
for(var i = 0; i<a.length; i++){
  ai = a[i];
  ai.innerText = '333'
}
```
innerText 为什么要赋给新变量：
innertext指元素内部的文本，通过innertext的值就可以改页面了。

###
function也可以理解为一个操作，一个过程。

[11,2,23,21,3,21].forEach(function(e,s){
  ..
  })
函数式编程



### ES6
- const a = {};
  a = 1; //error
  a.k = 1;
  console.log(a) // {k:1}
ES6中的const，不能更改，对象的引用是不能更改的，但也不是完全不能更改，a的key／value可以改

- let
let一般用在循环里。

- 语法糖： 很多语法规则让语法变得更短。

- es6中函数的变化很大，优化成 => 这个符号就是跟函数的概念一样，就是把parameter变成=> 后面的东西。

- 代码规范：
![airbnb的规范是最权威的。] (https://github.com/airbnb/javascript)


### javascript在网页中的作用，就是操作dom
jquery（cheer.io）体系

jquery：
```js
var text = $(".value").text();
```


### AJAX请求
动态的。 别的都是把数据写死在标签里。
ex：
```js
$.getJSON(./data.json,function(d){
  $('.value')
  })
```

JSON包的请求 只能有server才能做。 从本地搞到网页上去。 静态服务器

上面代码就是异步的，函数可以作为参数。（并发） 和并联电路串联电路差不多
就是说 getJSON 取到了之后才执行后面那个作为参数的函数

ajax出现就是 = 异步js和XML 无需刷新网页。

除了dom标签，还有xpath：（别的标签）
canvas（就像ps，一张图片，但是也有类库比如echart 性能kennel比svg好）；

svg（类似矢量的，还是有结构的可以一点一点改的）；

webgl；

### canvas
canvas里面的width 和height与css是两套东西

```js
const canvas = $('#canvas')[0];
const ctx    = canvas.getContext('2d');
ctx.fillStyle = '#f00';
ctx.fillRect(30,10,10,10);

ctx.strokeStyle = '#0ff';
ctx.arc(100,100, 100, 0, Math.PI * 2);
ctx.stroke();
```
 用jquery取，但是取回来是一整个的，我们还要定义一个变量来getcontext（2d）

### 浏览器的沙盒（前端）有很多限制，保护电脑不被注入病毒
不能运行本地可执行程序
不能读写
同源策略

做动画（循环）
settimeout
requestanimateframe

### 阿里巴巴抢月饼事件
就是改function settimeout 自己调用自己。

### xss注入
2005年的萨米蠕虫病毒

### node.js可以做很多东西
数据处理，爬虫（爬虫和服务器的概念特别像），区块链，图像处理，模拟浏览器（可以做个假的浏览器）。
还可以做病毒。
child process用来执行命令的

### url资源
请求的生命周期：
进入=》 解析=》判断登陆（有可能）=》··取数据··=》返回
只有取数据是不同的。
header里面 有get和post 取数据和加数据的。

### express 与node原生服务器
```js
http.createServer((request, response) => {
	response.end('hello visitor!');
}).listen(8888)
```
只要执行东西，就要在createserver里面的函数里执行，但是东西一多里面的函数会很乱，所以我们要用一个东西叫express

```js
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = 8888;
app.set('port', port);
server.listen(port);

app.get('/', (req, res) => {
	res.json({xx:1})
});
```
express生成标准化模块：express-generator
写代码时候很多时候是体力劳动，所以有时候要有点别的办法 比如脚手架（generator）：express-generator。

express generator的规范要看。

express最大的功能就是跟数据库连接

express路由：

express中间件：可以插不同的流水线“（ 进入=》 解析=》判断登陆（有可能）=》··取数据··=》返回 ）”
进去
判断，经过很多层中间件，最后达到url类似这种：
https://www.mediawiki.org/wiki/API:Main_page
这个就是经过了2层中间件

express模版引擎：express里面的render方法，就是发送模版给网页（就是jade和view的东西）


以上就是 渲染的几种形式


多花点时间看express。



### Nodejs与js的模块化
就是引用多个的js文件
变量的名字很容易污染 所以引用了模块化 commonjs规范 require进来，export出去，但是这个方式浏览器不懂，所以要有一个编译的过程（就是转换浏览器不认识的代码到浏览器认识的代码），高级点的就是监听，监听代码的变化 自动转换 （webpack）webpack就是一个编译器



如何部署：
如何买域名，与服务器链接
买服务器
工具：transmit 链接服务器 本地文件都可以拖动文件到服务器
在commandline上，cd到那个文件夹，然后启动服务器。
服务器部署：服务器关闭以后服务器就不能访问了 如果想要进程一直开着，那就得用一些别的方法。
调试阶段过后用 tmux 启动服务，再关掉就可以稳定的运行了。



希拉里邮件的数据抛到cdn上，一次性载入到前段
一次性载入 减少了工程的复杂性，有时候要用缓载入（stream）
