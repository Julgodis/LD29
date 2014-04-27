/*
*
*  Julgodis 2014
*  intro.js
*
*/

var Intro = function (game) { };
Intro.prototype = 
{
	// Not needed, everythings is already loaded!
	//preload: function() {} 

	create: function()
	{
		var w = game.width;
		var h = game.height;

		gameLabel = game.add.bitmapText((w / 2) - 200, (h / 4)-40, 'pixel_font', 'Sea Fighters', 30);
		creditLabel = game.add.bitmapText((w / 2) - 200, (h / 4)+20, 'pixel_font', 'By Julgodis 2014', 16);
		ldLabel = game.add.bitmapText((w / 2) - 200, (h / 4)+40, 'pixel_font', 'Entry for Ludum Dare 29', 16);

		game.score.music = game.add.audio('music');
		game.score.music.volume = 0.2;
		game.score.music.loop = true;
		if(game.score.sound)
    		game.score.music.play();

		this.next = game.time.now + 2500;
		game.stage.backgroundColor = '#0094FF';
	},
	update: function()
	{
		if(game.time.now - this.next > 0)
		{
			game.state.start('menu');
		}

	},
	shutdown: function()
	{
		gameLabel = null;
	}
};
