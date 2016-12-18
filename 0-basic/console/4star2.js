
let container = document.getElementById('Profile-following');
let buttons = container.getElementsByClassName('Button--primary Button--blue');
let n = buttons.length;
let starIndex = 0;

const star = (button, i) => {
	if (!button.click) return;
	setTimeout(() => {
		button.click();
		starIndex++;
		console.log(`您关注了${starIndex}个大牛`);
	}, 3000 * (i + Math.random()));
}

const runStar = () => {
	for (var i = 0; i < buttons.length; i++) {
		let button = buttons[i];
		star(button, i);
	}
}


const pageDown = (i) => {
	setTimeout(() => {
		window.scrollTo(0, 1000 * i);
		console.log(`翻到第${i}页`)
	}, i * 1000)
};

const runPageDown = () => {
	for(let i =0; i<20; i++){
		pageDown(i)
	}
}

runPageDown();
setTimeout(runStar, 21 * 1000)
