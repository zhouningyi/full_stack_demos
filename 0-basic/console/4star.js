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
	}, 100 * i);
}

for (var i = 0; i < buttons.length; i++) {
	let button = buttons[i];
	star(button, i);
}



