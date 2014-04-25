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
		game.add.sprite(0, 0, 'cat');
	}
};
