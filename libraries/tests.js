//Set of unit tests for various functionalities in the game engine.
var testCanvas=document.createElement("canvas");
testCanvas.id="testCanvas";
document.body.appendChild(testCanvas);
var testGame=new Game("testCanvas");

//Asset loader

function testAssets(){
	//Load an audio file, image file, file with unknown filetype, and a nonexistent file.
	//testGame.assets.load(["sound/tearing-up-spacetime.mp3", "images/foreverAlone.gif", "randFiletype.asdf", "nonexistent.gif"], function(){console.log("Assets Loaded")});
	
	//Load an image file, file with unknown filetype, and a nonexistent file.
	testGame.assets.load(["images/foreverAlone.gif", "randFiletype.asdf", "nonexistent.gif"], function(){console.log("Assets Loaded")});
}