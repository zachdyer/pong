function Game(canvasID) {
	//Take out body spacing and silly side bars
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	document.body.style.overflow = "hidden";
	document.body.style.cursor = "none";
	
	//Allows you to set the cursor type or turn it off
	this.cursor = function(bool, type) {
		if(bool) {
			document.body.style.cursor = type;
		} else {
			document.body.style.cursor = "none";
		}
	}
	
	//Importing the Game object for function use
	var self = this;
	
	this.canvasElement = document.getElementById(canvasID);
	
	this.screen = new Object;
	this.screen.adjust=function (){
		self.screen.width = window.innerWidth;
		self.screen.height = window.innerHeight;
		console.log(self.screen.height)
		self.canvasElement.width = self.screen.width;
		self.canvasElement.height = self.screen.height;
	}

	this.canvasElement.style.backgroundColor = "black";

	//Canvas size updates when window size changes
	window.onresize = function(){self.screen.adjust()};
	this.screen.adjust();
	
	this.context = this.canvasElement.getContext("2d");
	
	this.clearScreen = function(){
		self.context.clearRect(0, 0, self.screen.width, self.screen.height);
	};

	//FPS Stuff
	this.fps = new Object;
	var currentTime = 0;
	var lastTime = 0;
	this.fps.timePerTick = 0;
	this.fps.update = function() {
		currentTime = Date.now();
		self.fps.timePerTick = currentTime - lastTime;
		self.fps.current = (1000 / self.fps.timePerTick).toFixed();
		lastTime = currentTime;
	};
	this.speedPerSecond = function(speed) {
		return speed / self.fps.timePerTick;
	};
	
	this.loop = function (custom){
		requestAnimationFrame(function(){
			self.fps.update();
			self.clearScreen();
			custom();
			self.loop(custom);
		})
 	};
}