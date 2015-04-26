//Set of unit tests for various functionalities in the game engine.
var testCanvas=document.createElement("canvas");
testCanvas.id="testCanvas";
document.body.appendChild(testCanvas);
var testGame=new Game("testCanvas");

//Asset loader

function testAssets(){
	testGame.assets.load(["sound/tearing-up-spacetime.mp3"], function(){console.log(testGame.assets)});
}