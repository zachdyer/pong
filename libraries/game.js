function Game(canvasID) {
	//Take out body spacing
	document.body.style.margin = 0;
	document.body.style.padding = 0;
	
	var canvasElement = document.getElementById(canvasID);
	
	//Canvas full screen with black background
	canvasElement.width = window.innerWidth;
	canvasElement.height = window.innerHeight;
	canvasElement.style.backgroundColor = "black";
	
	//Canvas size updates when window size changes
	window.onresize = function() {
		canvasElement.width = window.innerWidth;
		canvasElement.height = window.innerHeight;
	};
	
	this.canvas = canvasElement.getContext("2d");
	
	//Total frames per second
	this.fps = 0;
	var currentTime = new Number();
	var lastTime = new Number();
	
	//Can't use the this keyword in this.functions unless I save it in a variable
	var self = this;

	var interval;
	
	var getFPS = function(currentTime, lastTime) {
		var fps = 1000 / (currentTime - lastTime);
		return fps.toFixed();
	};
	
	var step = function(custom){
		currentTime = Date.now();
		self.fps = getFPS(currentTime, lastTime);
		lastTime = currentTime;
		custom();
	};
	
	this.loop = function (custom) {
	interval = setInterval(function(){
		step(custom);
		},17);
	};
	
}