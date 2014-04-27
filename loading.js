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
		game.stage.backgroundColor = '#0094FF';
		game.load.image('loading1', 'assets/loadingBarBase.png');
		game.load.image('loading2', 'assets/loadingBar.png');

		game.load.bitmapFont('pixel_font', 'assets/font.png', 'assets/font.xml');
		game.load.bitmapFont('pixel_font_blue', 'assets/fontBlue.png', 'assets/font.xml');

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

		var gameLabel = game.add.bitmapText((w / 2) - 200, (h / 4)-40, 'pixel_font', 'Sea Fighters', 30);
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
		game.load.spritesheet('ship', ['assets/ship.png','assets/ship.PNG'], 32, 21);
		game.load.spritesheet('explosion', 'assets/explosion.png', 128/4, 128/4);
		game.load.spritesheet('water', 'assets/water.png', 16, 16);
		game.load.spritesheet('water_top', 'assets/water_top.png', 16, 16);

		game.load.spritesheet('enemy_0', 'assets/enemy_0.png', 27, 16);
		game.load.spritesheet('enemy_1', 'assets/enemy_1.png', 27, 16);
		game.load.spritesheet('enemy_2', 'assets/enemy_2.png', 27, 16);

		game.load.spritesheet('ship_side', 'assets/ship_side.png', 53, 22);

		game.load.script('abstracFilter', 'js/filters/AbstractFilter.js');
		game.load.script('dcfilter', 'js/filters/DisplacementFilter.js');
		game.load.script('pzfilter', 'js/filters/PixelateFilter.js');

		game.load.script('filter', 'water.js');

		game.load.image('rocket', 'assets/rocket.png');
		game.load.image('enemy_rocket', 'assets/rocket_enemy.png');
		game.load.image('bullet', 'assets/bullet.png');
		game.load.image('enemy_bullet', 'assets/enemy_bullet.png');

		game.load.image('smoke', 'assets/smoke.png');
		game.load.image('overscreen', 'assets/overscreen.png');
		game.load.image('background', 'assets/background.png');
		game.load.image('sandhouse', 'assets/sandhouse.png');
		game.load.image('border', 'assets/launch_border.png');
		game.load.image('hp_green', 'assets/hp_full.png');
		game.load.image('hp_red', 'assets/hp_empty.png');
		game.load.image('autogun', 'assets/autogun.png');

		game.load.audio('boom', 'assets/boom.wav');
		game.load.audio('click', 'assets/click.wav');
		game.load.audio('shot', 'assets/shot1.wav');
		game.load.audio('thrust', 'assets/thurst.wav');
		game.load.audio('upgrade', 'assets/upgrade.wav');
		game.load.audio('music', 'assets/sea_fighters.wav');


		// Testing loading bar!
/*		for (var i = 0; i < 10000; i++) 
		{
			game.load.image('cat' + i, 'assets/test.jpg');
		};*/
	},
	create: function()
	{
		game.state.start('intro');
	}
};
