function Game(canvasID) {
	//Take out body spacing and silly side bars
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	document.body.style.overflow = "hidden";
	document.body.style.cursor = "none";
	
	this.cursor = function(bool, type) {
		if(bool) {
			document.body.style.cursor = type;
		} else {
			document.body.style.cursor = "none";
		}
	}
	
	//Can't use the this keyword in functions unless I save it in a variable and I have no idea why
	var self = this;
	
	this.canvasElement = document.getElementById(canvasID);
	
	this.screen = {};
	this.screen.width = window.innerWidth;
	this.screen.height = window.innerHeight;
	
	//Canvas full screen with black background
	this.canvasElement.width = this.screen.width;
	this.canvasElement.height = this.screen.height;
	this.canvasElement.style.backgroundColor = "black";
	
	//Canvas size updates when window size changes
	window.onresize = function() {
		self.screen.width = window.innerWidth;
		self.screen.height = window.innerHeight;
		self.canvasElement.width = self.screen.width;
		self.canvasElement.height = self.screen.height;
	};
	
	this.context = this.canvasElement.getContext("2d");
	
	var interval;
	
	var clearScreen = function(){
		self.context.clearRect(0, 0, self.screen.width, self.screen.height);
	};
	
	//Export FPS
	this.fps = 0;
	
	//FPS Stuff
	var fps = {};
	fps.currentTime = new Number();
	fps.lastTime = 0;
	fps.updateTime = Date.now();
	fps.get = function(currentTime, lastTime) {
		var fps = 1000 / (currentTime - lastTime);
		return fps.toFixed();
	};
	fps.update = function() {
		fps.currentTime = Date.now();
		if(fps.currentTime - fps.updateTime >= 1000) {
			self.fps = fps.get(fps.currentTime, fps.lastTime);
			fps.updateTime = fps.currentTime;
		}
		fps.lastTime = fps.currentTime;
	};
	
	var step = function(custom){
		fps.update();
		clearScreen();
		custom();
	};
	
	this.loop = function (custom) {
	interval = setInterval(function(){
		step(custom);
		},16);
	};
	
}