/*
*
*  Julgodis 2014
*  dead.js
*
*/

var Dead = function (game) { };
Dead.prototype = 
{
	// Not needed, everythings is already loaded!
	//preload: function() {} 

	create: function()
	{
		var w = game.width;
		var h = game.height;

		gameLabel = game.add.bitmapText((w / 2) - 200, (h / 4)-80, 'pixel_font', 'Sea Fighters', 30);
		deadLabel = game.add.bitmapText((w / 2) - 110, (h / 4)+50, 'pixel_font', 'DEAD', 50);

		obj1Label = game.add.bitmapText((w / 2) - 300, (h / 4)+200, 'pixel_font', 'The alien won!', 16);
		obj2Label = game.add.bitmapText((w / 2) - 300, (h / 4)+230, 'pixel_font', 'Upgrade your ship to', 16);
		obj3Label = game.add.bitmapText((w / 2) - 300, (h / 4)+260, 'pixel_font', 'be able to kill more fishes!', 16);

		graphicsButton = game.add.graphics((w / 2) + 100-15, (h / 4)+400-32);
    	graphicsButton.beginFill(0xFFFFFF);
    	graphicsButton.drawRect(0, 0, 250, 48);
		graphicsButton.endFill();

		buttonText = game.add.bitmapText((w / 2) + 100, (h / 4)+400-16, 'pixel_font_blue', 'Back', 22);

		fader = game.add.graphics(0, 0);
    	fader.beginFill(0x000000);
    	fader.drawRect(0, 0, game.width, game.height);
		fader.endFill();
		fader.alpha = 1;

		tweenStartGame = game.add.tween(fader);
		tweenStartGame.to({ alpha: 0.0 }, 500);
		tweenStartGame.start();

		click = game.add.audio('click');
		click.volume = 0.4;
		game.stage.backgroundColor = '#FF1E00';
	},
	update: function()
	{
		var mx = game.input.x;
		var my = game.input.y;

		var w = game.width;
		var h = game.height;

		graphicsButton.alpha = 1.0 - Math.abs(Math.cos(game.time.now/300.0)/3.0);
		if(mx >= (w / 2) + 100 && mx <= (w / 2) + 100 + 250)
		{
			if(my >= (h / 4)+400-10-16 && my <= (h / 4)+400-10+48-16)
			{
				graphicsButton.alpha = 0.5;
				if(game.input.activePointer.isDown)
				{
					this.launch();
				}
			}
		}

	},
	launch: function()
	{
		if(game.score.sound)
			click.play();
		tweenNextLevel = game.add.tween(fader);
		tweenNextLevel.to({ alpha: 1.0 }, 1000);
		tweenNextLevel.onComplete.add(this.gameLevel);
		tweenNextLevel.start();
	},
	gameLevel: function()
	{
		game.state.start('menu');
	},
	shutdown: function()
	{
		gameLabel = null;
	}
};
