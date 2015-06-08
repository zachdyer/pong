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
		self.canvasElement.width = self.screen.width;
		self.canvasElement.height = self.screen.height;
	}

	this.canvasElement.style.backgroundColor = "black";

	//Canvas size updates when window size changes
	window.onresize = function(){self.screen.adjust()};
	this.screen.adjust();
	
	this.context = this.canvasElement.getContext("2d");
	
	var clearScreen = function(){
		self.context.clearRect(0, 0, self.screen.width, self.screen.height);
	};

	//Export FPS
	this.fps = 0;
	
	//FPS Private stuff
	var fps = {};
	fps.currentTime = new Number();
	fps.lastTime = 0;
	fps.timePerTick = 17;
	fps.updateTime = Date.now(); //This sets a time stamp every second to update the Game.fps
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
		fps.timePerTick = fps.currentTime - fps.lastTime;
		fps.lastTime = fps.currentTime;
		
	};
	
	//Other function
	this.speedPerSecond = function(speed) {
		return speed / fps.timePerTick;
	};

	this.assets=new Object;
	this.assets.queue=[]; //list of currently downloading assets
	this.assets.loaded=[]; //list of previously loaded assets
	this.assets.errors=[]; //list of assets that failed to load
	//Takes urls of assets in list, loads them, and stores them in game.assets object. 
	this.assets.load=function(urls, callback){ 
		for (var x=0;x<urls.length;x++){
			//have url: "images/foreverAloneGameOver.gif"
			//split on every slash: ["images", foreverAloneGameOver.gif"]
			//get last item: "foreverAloneGameOver.gif"
			//split on period: ["foreveralone	", "gif"]
			//first item is filename. Last item is file type.
			file=urls[x].split("/").pop().split(".");
			fileName=file[0];
			fileType=file.pop();
			typeRecognized=false;
			//create correct object for type of asset
			console.log("Filename: "+fileName+". Filetype: "+fileType);
			if (["gif", "png"].indexOf(fileType)!=-1){//If dealing with image
				item=document.createElement("img");
				typeRecognized=true;
			}
			if (["mp3"].indexOf(fileType)!=-1){//If dealing with sound
				item=document.createElement("audio")
				typeRecognized=true;
			}
			//If there is an unrecognized filetype.
			if (!typeRecognized){
				console.log("Unknown filetype: "+fileType);
				self.assets.errors.push([urls[x], "Unknown filetype"]);
				continue;
			}
			self.assets.queue.push(fileName);
			item.fileName=fileName;
			item.fileType=fileType;
			//KNOWN ISSUE: Audio elements do not seem to use the load event.
			//If audio is queued, neither the load nor the error listener is triggered.
			//Is there an easy way to duplicate the action of the load listener, without duplicating the code?
			item.addEventListener("load", function(){
				//Loaded successfully
				self.assets.loaded.push(this.fileName);
				self.assets[this.fileName]=this;
				//remove from queue, and check if queue is empty. Call callback if queue is empty.
				//Yes, for now, this code is duplicated.
				self.assets.queue.splice(self.assets.queue.indexOf(this.fileName), 1);
				if (self.assets.queue.length==0){callback();};
			}, false);
			item.addEventListener("error", function(err){
				//Error
				self.assets.errors.push([this.fileName, err])
				self.assets.queue.splice(self.assets.queue.indexOf(this.fileName), 1);
				if (self.assets.queue.length==0){callback();};
			}, false);
			item.src=urls[x];
		}
	}
	
	//This starts the main game loop
	this.loop = function (custom){
		requestAnimationFrame(function(){
			fps.update();
			clearScreen();
			custom();
			self.loop(custom);
		})
 	};
}