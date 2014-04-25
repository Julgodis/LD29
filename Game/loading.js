/*
*
*  Julgodis 2014
*  loading.js
*
*/

// Cool loading effect!

var Start = function (game) { };
var Loader = function (game) { };

Start.prototype = 
{
	preload: function()
	{
		game.stage.backgroundColor = '#555555';
		game.load.image('loading1', 'assets/loadingBarBase.png');
		game.load.image('loading2', 'assets/loadingBar.png');

		game.load.bitmapFont('pixel_font', 'assets/font.png', 'assets/font.xml');
	},
	create: function()
	{
		game.state.start('loading');
	}
};

Loader.prototype = 
{
	preload: function ()
	{
		// Why do I do this?
		var w = game.width;
		var h = game.height;

		var gameLabel = game.add.bitmapText((w / 2) - 200, (h / 4), 'pixel_font', 'GAME_NAME', 40);
		var text = game.add.bitmapText(w / 2, (h / 2) - 10, 'pixel_font', 'Loading...', 18);
		// To bad, no anchor property!
		//text.anchor.setTo(0.5, 0.5);

		// Bad fix
		text.position.x = (w / 2) - 100;	

		// Loading animation
		var loadingBase = game.add.sprite(w / 2, (h / 2) + 15, 'loading1');
		loadingBase.x -= loadingBase.width / 2;	

		var loadingBar = game.add.sprite(w / 2, (h / 2) + 15, 'loading2');
		loadingBar.x -= loadingBar.width / 2;
		game.load.setPreloadSprite(loadingBar);

		// Content to load
		game.load.image('cat', 'assets/test.jpg');

		// Testing loading bar!
		for (var i = 0; i < 10000; i++) 
		{
			game.load.image('cat' + i, 'assets/test.jpg');
		};
	},
	create: function()
	{
		game.state.start('intro');
	}
};
