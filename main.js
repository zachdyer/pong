//Things that are related to the screen
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var screenWidth = window.innerWidth;
var screenHeight= window.innerHeight;
canvas.width = window.innerWidth;
canvas.height =  window.innerHeight;
var screenAdjust = function() {
	screenWidth = window.innerWidth;
	console.log("screenWidth: " + screenWidth);
	console.log("window.innerWidth: " + window.innerWidth);
	screenHeight= window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
};
screenClear = function(){
	context.clearRect(0,0,screenWidth,screen.height);
};
var screenDraw = function(){
	if(image.loaded === false){
		screenLoading();
	} else if(game.title && image.loaded){
		game.titleScreen();
		game.drawScore();
	} else if(game.play) {
		bar.draw();
		ball.draw();
		game.drawScore();
	} else if(game.over) {
		game.overScreen();
		game.drawScore();
		
	}
	if(image.loaded){
		sound.drawMute();
		game.drawMode();
	}
};
var screenFlash = function(){
	color.select(color.white);
	var ctx = context;
	ctx.fillRect(0,0,screenWidth,screen.height);
};
var screenLoading = function(){
	var ctx = context;
	color.select(color.white);
	ctx.textAlign = "center";
	ctx.fillText("Loading...",screenWidth / 2, screenHeight/ 2);
};

var ball = new Object();
ball.size = 10;
ball.speed = 0;
ball.speedIncrementer = 0.5;
ball.x = screenWidth / 2;
ball.y = screenHeight*.67 - ball.size;
ball.speedX = ball.speed;
ball.speedY = ball.speed;
ball.launched = false;
ball.launch = function(){
	ball.launched = true;
	ball.speed = 3;
	ball.speedX = ball.speed;
	ball.speedY = -ball.speed;
}
ball.update = function(){
	if(ball.launched){
		if(ball.hitBottomSide()){
			game.play = false;
			game.over = true;
		}
		if(ball.hitRightSide()){
			ball.speedX = -ball.speed;
			game.score++;
		}
		if(ball.hitTopSide()){
			ball.speedY = ball.speed;
			game.score++;
		}
		if(ball.hitLeftSide()){
			ball.speedX = ball.speed;
			game.score++;
		}
		if(ball.hitBar()){
			ball.speedY = -ball.speed;
			game.score++;
		}
		ball.x += ball.speedX;
		ball.y += ball.speedY;
	} else {
		ball.x = bar.x + bar.width / 2;
		ball.y = screenHeight*.67 - ball.size;
	}
};
ball.draw = function(){

	//var r = Math.round(Math.random() * 255);
	//var g = Math.round(Math.random() * 255);
	//var b = Math.round(Math.random() * 255);
	var r = color.red;
	var g = color.green;
	var b = color.blue;
	switch(color.rgb){
		case 1:
			if(color.red < 255){
				color.red += color.change;
				color.blue -= color.change;
			} else {
				color.rgb = 2;
			}
			break;
		case 2:
			if(color.green < 255){
				color.green += color.change;
				color.red -= color.change;
			} else {
				color.rgb = 3;
			}
			break;
		case 3:
			if(color.blue < 255){
				color.blue += color.change;
				color.green -= color.change;
			} else {
				color.rgb = 1;
			}
			break;
	}
	ball.trail(r,g,b);
	context.fillStyle = color.white;
	draw.circle(ball.x,ball.y,ball.size);
};
ball.particles = [];
ball.trail = function(r,g,b){
	ball.particles.unshift(new ball.particle(ball.x,ball.y,r,g,b));
	if(ball.particles.length > ball.particleAmount){
		ball.particles.pop();
	}
	var opacityMax = 1;
	var opacityMin = 0;
	var opacityFactor = (opacityMax - opacityMin) / ball.particleAmount;
	var sizeFactor = ball.size / ball.particleAmount;
	for(var i = ball.particles.length-1; i >= 0; i--){
		var n = ball.particles.length - i;
		var opacity = n * opacityFactor + opacityMin;
		//var size = n * sizeFactor;
		//var size = n * 1.1;
		var size = ball.size;
		context.fillStyle = "rgba(" + ball.particles[i].r + "," + ball.particles[i].g + "," + ball.particles[i].b + "," + opacity + ")";
		draw.circle(ball.particles[i].x,ball.particles[i].y,size);
	}
};
ball.particle = function(x,y,r,g,b){
	this.x = x;
	this.y = y;
	this.r = r;
	this.g = g;
	this.b = b;
}
ball.particleAmount = 20;
ball.hitBottomSide = function(){
	if(ball.y > screenHeight- ball.size){
		if(game.siezureMode)
			screenFlash();
		if(sound.muted === false)
			sound.explosion.play();
		return true;
	} else {
		return false;
	}
};
ball.hitRightSide = function(){
	if(ball.x > screenWidth - ball.size){
		ball.speed += ball.speedIncrementer;
		if(game.siezureMode)
			screenFlash();
		if(sound.muted === false){
			sound.bounce.load();
			sound.bounce.play();
		}
		return true;
	} else {
		return false;
	}
};
ball.hitTopSide = function(){
	if(ball.y < 0 + ball.size){
		ball.speed += ball.speedIncrementer;
		if(game.siezureMode)
			screenFlash();
		if(sound.muted === false){
			sound.bounce.load();
			sound.bounce.play();
		}
		return true;
	} else {
		return false;
	}
};
ball.hitLeftSide = function(){
	if(ball.x < 0 + ball.size){
		ball.speed += ball.speedIncrementer;
		if(game.siezureMode)
			screenFlash();
		if(sound.muted === false){
			sound.bounce.load();
			sound.bounce.play();
		}
		return true;
	} else {
		return false;
	}
};
ball.hitBar = function(){
	if(ball.x > bar.x && ball.x < bar.x + bar.width && ball.y > bar.y - ball.size && ball.y < bar.y + bar.height){
		ball.speed += ball.speedIncrementer;
		if(game.siezureMode)
			screenFlash();
		if(sound.muted === false){
			sound.bounce.load();
			sound.bounce.play();
		}
		return true;
	} else {
		return false;
	}
};
ball.reset = function(){
	ball.speed = 0;
	ball.x = screenWidth / 2;
	ball.y = screenHeight*.67 - ball.size;
	ball.speedX = ball.speed;
	ball.speedY = ball.speed;
	ball.launched = false;
};

var bar = new Object();
bar.width = 100;
bar.height = 30;
bar.x = screenWidth / 2 - bar.width / 2;
bar.y = screenHeight* 0.67;
bar.move = function(event){
	bar.x = event.clientX;
};
bar.draw = function(){
	var ctx = context;
	color.select(color.white);
	bar.y = screenHeight* 0.67;
	ctx.fillRect(bar.x, bar.y, bar.width, 30);
};
var sound = new Object();
sound.music = document.createElement("audio");
sound.music.src = "sound/tearing-up-spacetime.mp3";
sound.music.play();
sound.music.loop = true;
sound.rayGun = document.createElement("audio");
sound.rayGun.src = "sound/rayGun.mp3";
sound.rayGun.volume = 0.75
sound.bounce = document.createElement("audio");
sound.bounce.src = "sound/bounce.mp3";
sound.explosion = document.createElement("audio");
sound.explosion.src = "sound/explosion.mp3";
sound.muted = false;
sound.mute = function(){
	if(sound.muted === false){
		sound.muted = true;
		sound.music.pause();
	} else {
		sound.muted = false;
		sound.music.play();
	}
};
sound.drawMute = function(){
	var ctx = context;
	ctx.font = "10pt Arial";
	ctx.textAlign = "right";
	if(sound.muted){
		ctx.fillText("M - Muted", screenWidth - 20, 50);
	} else {
	 	ctx.fillText("M - Mute", screenWidth - 20, 50);
	}
};

var image = new Object();
image.foreverAlone = new Image();
image.foreverAlone.src = "images/foreverAlone.gif";
image.foreverAloneGameOver = new Image();
image.foreverAloneGameOver.src = "images/foreverAloneGameOver.gif";
image.images = [
	image.foreverAlone,
	image.foreverAloneGameOver	
];
image.imageCount = 0;
image.loaded = false;
image.load = function(){
	for(var i = 0; i < image.images.length; i++){
		image.images[i].onload = function(){
			image.imageCount++;
			if(image.imageCount === image.images.length){
				image.loaded = true;
			}
		};
	}
};

var game = new Object();
game.score = 0;
game.highScore = 0;
game.drawScore = function(){
	var ctx = context;
	ctx.font = "10pt Arial";
	ctx.textAlign = "left";
	ctx.fillText("Score: " + game.score, 20, 50);
	ctx.fillText("High Score: " + game.highScore, 20, 70);
};
game.load = function(){
	screenAdjust();
	image.load();
};
game.update = function(){
	if(game.play){
		ball.update();
	}
};
game.click = function(){
	if(game.title){
		game.title = false;
		game.play = true;
	} else if(game.play){
		if(ball.launched === false){
			if(sound.muted === false)
				sound.rayGun.play();
			ball.launch();
		}
	} else if(game.over){
		game.title = true;
		game.over = false;
		game.reset();
	}
};
game.keyboard = function(evt){
	log(evt.keyCode);
	switch(evt.keyCode){
		case 77:
			sound.mute();
			break;
		case 83:
			if(game.siezureMode){
				game.siezureMode = false;
			} else {
				game.siezureMode = true;
			}
			break;
	}
};
game.loop = function(){
	screenClear();
	screenDraw();
	game.update();
};
game.title = true;
game.play = false;
game.over = false;
game.siezureMode = true;
game.titleBlinker = 0;
game.titleScreen = function(){
	var ctx = context;
	//Draw Image of Forever Alone
	ctx.drawImage(image.foreverAlone,0,screenHeight- image.foreverAlone.height);
	ctx.textAlign = "center";
	color.select(color.white);
	ctx.font = "80pt Arial";
	ctx.fillText("PONG",screenWidth / 2, screenHeight/ 2 - 50);
	ctx.font = "20pt Arial";
	ctx.fillText("Forever Alone Edition",screenWidth / 2, screenHeight/ 2);
	ctx.font = "15pt Arial";
	ctx.fillText("Beta",screenWidth / 2, screenHeight/ 2 + 50);
	game.titleBlinker++;
	if(game.titleBlinker < 30){
		ctx.fillText("Click to Start!",screenWidth / 2, screenHeight/ 2 + 100);
	} else if(game.titleBlinker > 60){
		game.titleBlinker = 0;
	};
	
};
game.overScreen = function(){
	var ctx = context;
	//Draw Image of Forever Alone
	ctx.drawImage(image.foreverAloneGameOver,0,screenHeight- image.foreverAloneGameOver.height);
	var message = "Game Over!";
	ctx.font = "40pt Arial";
	ctx.textAlign = "center";
	color.select(color.white);//Fixes a bug when you adjust the window the message disappears.
	ctx.fillText(message, screenWidth / 2, screenHeight/ 2);
	ctx.font = "15pt Arial";
	game.titleBlinker++;
	if(game.titleBlinker < 30){
		ctx.fillText("Click to continue...", screenWidth / 2, screenHeight/ 2 + 100);
	} else if(game.titleBlinker > 60){
		game.titleBlinker = 0;
	}
};
game.reset = function(){
	if(game.score > game.highScore){
		game.highScore = game.score;
		if(sound.muted === false){
			sound.rayGun.play();
		}
		alert("Congratulations! New high score!");
	}
	ball.particles = [];
	game.score = 0;
	ball.reset();
};
game.drawMode = function(){
	var ctx = context;
	ctx.fillSyle = color.white;
	if(game.siezureMode){
		ctx.fillText("S - Siezure Mode On", screenWidth - 20, 70);
	} else {
	 	ctx.fillText("S - Siezure Mode Off", screenWidth - 20, 70);
	}
};

//Library
var log = function(message){
	window.console.log(message);
};
var color = new Object();
color.select = function(color){
	context.fillStyle = color;
};
color.white = "#ffffff";
color.red = 0;
color.green = 0;
color.blue = 255;
color.rgb = 1;
color.change = 30;

var draw = new Object();
draw.circle = function(centerX,centerY,radius){
	var ctx = context;
	ctx.beginPath();
	ctx.arc(centerX,centerY,radius,0,2 * Math.PI, false);
	ctx.fill();
	ctx.closePath();
};
//Listeners
window.onresize = screenAdjust;
window.onmousemove = bar.move;
window.onclick = game.click;
window.onkeydown = game.keyboard;

game.load();

window.setInterval(game.loop, 1000 / 59);