/*
*
*  Julgodis 2014
*  game.js
*
*/

var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

game.state.add('start', Start);
game.state.add('loading', Loader);
game.state.add('intro', Intro);

// Run game!
game.state.start('start');

// Old
/*var sprite;
var fonts;

function preload() 
{
    game.load.image('test', 'assets/test.jpg');
    game.load.bitmapFont('pixel_font', 'assets/font.png', 'assets/font.xml');

	game.time.events.loop(Phaser.Timer.SECOND, function() {}, this);
}

function create() 
{
	//sprite = game.add.sprite(100, 100, 'test');
	game.add.bitmapText(10, 10, 'pixel_font', 'Hello, World!', 34);
	
}

function update()
{

}

function render() 
{

}
*/
