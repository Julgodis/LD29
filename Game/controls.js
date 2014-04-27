/*
*
*  Julgodis 2014
*  controls.js
*
*/

var Controls = function (game) { };
Controls.prototype = 
{
	// Not needed, everythings is already loaded!
	//preload: function() {} 

	create: function()
	{
		var w = game.width;
		var h = game.height;

		gameLabel = game.add.bitmapText((w / 2) - 200, (h / 4)-80, 'pixel_font', 'Sea Fighters', 30);
		controlLabel = game.add.bitmapText((w / 2) - 350, (h / 4)+20, 'pixel_font', 'Controls:', 20);

		moveLabel = game.add.bitmapText((w / 2) - 350, (h / 4) + 60, 'pixel_font', 'Movement: WASD', 12);
		aimLabel = game.add.bitmapText((w / 2) - 350, (h / 4) + 80, 'pixel_font',  'Aim:      MOUSE', 12);
		aimLabel = game.add.bitmapText((w / 2) - 350, (h / 4) + 100, 'pixel_font', 'Shoot:    LEFT-MOUSE BUTTON', 12);
		aimLabel = game.add.bitmapText((w / 2) - 350, (h / 4) + 120, 'pixel_font', 'Missiles: SPACEBAR', 12);

		// Less then one week ago Alien fishes land their spaceshipes 'Beneath the surface' in the sea. Your mission is to destroy as many alien fishes as you can!

		objectiveLabel = game.add.bitmapText((w / 2) - 350, (h / 4)+180, 'pixel_font', 'Objective:', 20);
		obj1Label = game.add.bitmapText((w / 2) - 350, (h / 4)+220, 'pixel_font', 'Less then one week ago Alien', 16);
		obj2Label = game.add.bitmapText((w / 2) - 350, (h / 4)+250, 'pixel_font', 'fishes land their spaceshipes ', 16);
		obj3Label = game.add.bitmapText((w / 2) - 350, (h / 4)+280, 'pixel_font', '\'Beneath the surface\' in the sea.', 16);
		obj4Label = game.add.bitmapText((w / 2) - 350, (h / 4)+310, 'pixel_font', 'Your mission is to destroy as ', 16);
		obj5Label = game.add.bitmapText((w / 2) - 350, (h / 4)+330, 'pixel_font', 'many alien fishes as you can!', 16);
		obj6Label = game.add.bitmapText((w / 2) - 350, (h / 4)+370, 'pixel_font', 'GO!!!!', 20);

		graphicsButton = game.add.graphics((w / 2) + 100-15, (h / 4)+400-32);
    	graphicsButton.beginFill(0xFFFFFF);
    	graphicsButton.drawRect(0, 0, 250, 48);
		graphicsButton.endFill();

		buttonText = game.add.bitmapText((w / 2) + 100, (h / 4)+400-16, 'pixel_font_blue', 'Continue', 22);

		fader = game.add.graphics(0, 0);
    	fader.beginFill(0x000000);
    	fader.drawRect(0, 0, game.width, game.height);
		fader.endFill();
		fader.alpha = 1;

		tweenStartGame = game.add.tween(fader);
		tweenStartGame.to({ alpha: 0.0 }, 500);
		tweenStartGame.start();

		game.stage.backgroundColor = '#0094FF';
		game.score.controls = true;

		click = game.add.audio('click');
		click.volume = 0.5;
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
		game.state.start('game');
	},
	shutdown: function()
	{
		gameLabel = null;
	}
};
