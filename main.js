function Main() {

	var version = "1.1.0";

	//Update the title to current version
	document.title = "Pong - Forever Alone Edition - Version " + version;

	//Using game library object
	var game = new Game('canvas');

	var screenDraw = function(){
		if(image.loaded === false){
			screenLoading();
		} else if(title && image.loaded){
			titleScreen();
			drawScore();
		} else if(play) {
			bar.draw();
			ball.draw();
			drawScore();
		} else if(over) {
			overScreen();
			drawScore();
		}
		drawVersion();
		if(image.loaded){
			sound.drawMute();
			drawMode();
		}
	};
	var screenFlash = function(){
		color.select(color.white);
		var ctx = game.context;
		ctx.fillRect(0,0,game.screen.width,screen.height);
	};
	var screenLoading = function(){
		var ctx = game.context;
		color.select(color.white);
		ctx.textAlign = "center";
		ctx.fillText("Loading...",game.screen.width / 2, game.screen.height / 2);
	};

	var ball = new Object();
	ball.size = 10;
	ball.speed = 0;
	ball.speedIncrementer = 0.5;
	ball.x = game.screen.width / 2;
	ball.y = game.screen.height *.67 - ball.size;
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
				play = false;
				over = true;
			}
			if(ball.hitRightSide()){
				ball.speedX = -ball.speed;
				score++;
			}
			if(ball.hitTopSide()){
				ball.speedY = ball.speed;
				score++;
			}
			if(ball.hitLeftSide()){
				ball.speedX = ball.speed;
				score++;
			}
			if(ball.hitBar()){
				ball.speedY = -ball.speed;
				score++;
			}
			ball.x += ball.speedX;
			ball.y += ball.speedY;
		} else {
			ball.x = bar.x + bar.width / 2;
			ball.y = game.screen.height *.67 - ball.size;
		}
	};
	ball.draw = function(){
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
		game.context.fillStyle = color.white;
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
			var size = ball.size;
			game.context.fillStyle = "rgba(" + ball.particles[i].r + "," + ball.particles[i].g + "," + ball.particles[i].b + "," + opacity + ")";
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
		if(ball.y > game.screen.height - ball.size){
			if(siezureMode)
				screenFlash();
			if(sound.muted === false)
				sound.explosion.play();
			return true;
		} else {
			return false;
		}
	};
	ball.hitRightSide = function(){
		if(ball.x > game.screen.width - ball.size){
			ball.speed += ball.speedIncrementer;
			if(siezureMode)
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
			if(siezureMode)
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
			if(siezureMode)
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
			if(siezureMode)
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
		ball.x = game.screen.width / 2;
		ball.y = game.screen.height *.67 - ball.size;
		ball.speedX = ball.speed;
		ball.speedY = ball.speed;
		ball.launched = false;
	};

	var bar = new Object();
	bar.width = 100;
	bar.height = 30;
	bar.x = game.screen.width / 2 - bar.width / 2;
	bar.y = game.screen.height * 0.67;
	bar.move = function(event){
		bar.x = event.clientX;
	};
	bar.draw = function(){
		var ctx = game.context;
		color.select(color.white);
		bar.y = game.screen.height * 0.67;
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
		var ctx = game.context;
		ctx.font = "10pt Arial";
		ctx.textAlign = "right";
		if(sound.muted){
			ctx.fillText("M - Muted", game.screen.width - 20, 50);
		} else {
			ctx.fillText("M - Mute", game.screen.width - 20, 50);
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

	var score = 0;
	var highScore = 0;
	var drawScore = function() {
		var ctx = game.context;
		ctx.font = "10pt Arial";
		ctx.textAlign = "left";
		ctx.fillText("Score: " + score, 20, 50);
		ctx.fillText("High Score: " + highScore, 20, 70);
	};
	var drawVersion = function() {
		var ctx = game.context;
		ctx.textAlign = "right";
		ctx.fillText("Version: " + version, game.screen.width - 20, game.screen.height  - 50);
	};
	var load = function() {
		image.load();
	};
	var update = function(){
		if(play){
			ball.update();
		}
	};
	var click = function(){
		if(title){
			title = false;
			play = true;
		} else if(play){
			if(ball.launched === false){
				if(sound.muted === false)
					sound.rayGun.play();
				ball.launch();
			}
		} else if(over){
			title = true;
			over = false;
			reset();
		}
	};
	var keyboard = function(evt){
		switch(evt.keyCode){
			case 77:
				sound.mute();
				break;
			case 83:
				if(siezureMode){
					siezureMode = false;
				} else {
					siezureMode = true;
				}
				break;
		}
	};
	var tick = function(){
		screenDraw();
		update();
	};
	var title = true;
	var play = false;
	var over = false;
	var siezureMode = true;
	var titleBlinker = 0;
	var titleScreen = function(){
		var ctx = game.context;
		//Draw Image of Forever Alone
		ctx.drawImage(image.foreverAlone,0,game.screen.height - image.foreverAlone.height);
		ctx.textAlign = "center";
		color.select(color.white);
		ctx.font = "80pt Arial";
		ctx.fillText("PONG",game.screen.width / 2, game.screen.height / 2 - 50);
		ctx.font = "20pt Arial";
		ctx.fillText("Forever Alone Edition",game.screen.width / 2, game.screen.height / 2);
		ctx.font = "15pt Arial";
		ctx.fillText("Beta",game.screen.width / 2, game.screen.height / 2 + 50);
		titleBlinker++;
		if(titleBlinker < 30){
			ctx.fillText("Click to Start!",game.screen.width / 2, game.screen.height / 2 + 100);
		} else if(titleBlinker > 60){
			titleBlinker = 0;
		};
		
	};
	var overScreen = function(){
		var ctx = game.context;
		//Draw Image of Forever Alone
		ctx.drawImage(image.foreverAloneGameOver,0,game.screen.height - image.foreverAloneGameOver.height);
		var message = "Game Over!";
		ctx.font = "40pt Arial";
		ctx.textAlign = "center";
		color.select(color.white);//Fixes a bug when you adjust the window the message disappears.
		ctx.fillText(message, game.screen.width / 2, game.screen.height / 2);
		ctx.font = "15pt Arial";
		titleBlinker++;
		if(titleBlinker < 30){
			ctx.fillText("Click to continue...", game.screen.width / 2, game.screen.height / 2 + 100);
		} else if(titleBlinker > 60){
			titleBlinker = 0;
		}
	};
	var reset = function(){
		if(score > highScore){
			highScore = score;
			if(sound.muted === false){
				sound.rayGun.play();
			}
			alert("Congratulations! New high score!");
		}
		ball.particles = [];
		score = 0;
		ball.reset();
	};
	var drawMode = function(){
		var ctx = game.context;
		ctx.fillSyle = color.white;
		if(siezureMode){
			ctx.fillText("S - Siezure Mode On", game.screen.width - 20, 70);
		} else {
			ctx.fillText("S - Siezure Mode Off", game.screen.width - 20, 70);
		}
	};

	//Library
	var log = function(message){
		console.log(message);
	};
	var color = new Object();
	color.select = function(color){
		game.context.fillStyle = color;
	};
	color.white = "#ffffff";
	color.red = 0;
	color.green = 0;
	color.blue = 255;
	color.rgb = 1;
	color.change = 30;

	var draw = new Object();
	draw.circle = function(centerX,centerY,radius){
		var ctx = game.context;
		ctx.beginPath();
		ctx.arc(centerX,centerY,radius,0,2 * Math.PI, false);
		ctx.fill();
		ctx.closePath();
	};

	//Listeners
	window.onmousemove = bar.move;
	window.onclick = click;
	window.onkeydown = keyboard;

	load();

	//Start game loop
	game.loop(tick);
}

Main();