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
		var sprite = game.add.sprite(0, 0, 'cat');
		sprite.scale.setTo(640/1024, 480/1024);

		game.state.start('test');
	}
};
