/*
*
*  Julgodis 2014
*  menu.js
*
*/

var Menu = function (game) { };
Menu.prototype = 
{
	// Not needed, everythings is already loaded!
	//preload: function() {} 
	tweenImageTile: [],
	tweenImage: [],
	tiles: [],
	imageGroup: null,
	create: function()
	{
		game.stage.backgroundColor = '#0094FF';
		var w = game.width;
		var h = game.height;

		var gameLabel = game.add.bitmapText((w / 2) - 200, (game.score.aniMenu?((h / 4)-40):((h / 4)-100)), 'pixel_font', 'Sea Fighters', 30);
		if(game.score.aniMenu)
		{
			tween = game.add.tween(gameLabel);
			tween.to({ x: (w / 2) - 200, y: (h / 4)-100 }, 1000);
			tween.start();
		}

		upgradLabel = game.add.bitmapText((w / 2) - 200, (h / 4)-30, 'pixel_font', '+ ', 16);
		upgradLabel.alpha = 0;

		this.imageGroup = game.add.group();

		var sw = 101*4;
		var sh = 114*4;

		boat = game.add.sprite(48*4+(37/53.0)*53*4, (game.score.aniMenu?h:0) - sh + h + 18*4+(22*4*(1-(1.5 / 22))), 'ship_side', null, this.imageGroup);
		boat.scale.setTo(4, 4);
		boat.smoothed = false;
		boat.anchor.setTo(37/53.0, 1 - (1.5 / 22)); // 1.5 = xx * 22
		boat.angle = 0; 

		for(var g = 0; g < 8; g++)
			boat.animations.add('fire' + g, [g*4+0, g*4+1, g*4+2, g*4+3], 30, true);

		boat.animations.frame = game.score.upgrad*4;

		for (var i = 0; i < 7; i++) 
		{
			for (var j = 0; j < 4; j++) 
			{
				var max = (j == 0) ? 12 : 6;

				var tData = [];
				var fData = [];
				for(var f= 0; f < max; f++)
				{
					tData[f] = false;
				}

				for(var f= 0; f < max; f++)
				{
					var index = game.rnd.integerInRange(0, max-1);
					while(tData[index])
						index = game.rnd.integerInRange(0, max-1);
					fData[f] = index;
					tData[index] = true;
				}

				if(j == 0)
				{
					this.tiles[i+j*7] = game.add.sprite(sw + 16 * i * 4 - 36, (game.score.aniMenu?(h + sh + 16 * 4 * (4-j)):(h - 16 * 4 * (4-j))), 'water_top', null, this.imageGroup);
					this.tiles[i+j*7].scale.setTo(4, 4);
					this.tiles[i+j*7].smoothed = false;
					this.tiles[i+j*7].animations.add('water', fData, 8, true);
					this.tiles[i+j*7].animations.play('water');

					if(game.score.aniMenu)
					{
						this.tweenImageTile[i+j*7] = game.add.tween(this.tiles[i+j*7]);
						this.tweenImageTile[i+j*7].to({ x: sw + 16 * i * 4 - 36, y: h - 16 * 4 * (4-j) }, 1000);
						this.tweenImageTile[i+j*7].start();
					}
				}
				else
				{
					this.tiles[i+j*7] = game.add.sprite(sw + 16 * i * 4 - 36, (game.score.aniMenu?(h + sh + 16 * 4 * (4-j)):(h - 16 * 4 * (4-j))), 'water', null, this.imageGroup);
					this.tiles[i+j*7].scale.setTo(4, 4);
					this.tiles[i+j*7].smoothed = false;
					this.tiles[i+j*7].animations.add('water', fData, 8, true);
					this.tiles[i+j*7].animations.play('water');

					if(game.score.aniMenu)
					{
						this.tweenImageTile[i+j*7] = game.add.tween(this.tiles[i+j*7]);
						this.tweenImageTile[i+j*7].to({ x: sw + 16 * i * 4 - 36, y: h - 16 * 4 * (4-j) }, 1000);
						this.tweenImageTile[i+j*7].start();
					}
				}
			}
		}

		sandhouse = game.add.sprite(0, h - sh + (game.score.aniMenu?h:0), 'sandhouse', null, this.imageGroup);
		sandhouse.scale.setTo(4, 4);
		sandhouse.smoothed = false;

		graphicsButton = game.add.graphics(510, (game.score.aniMenu?h:0)+200);
    	graphicsButton.beginFill(0xFFFFFF);
    	graphicsButton.drawRect(0, 0, 220, 48);
		graphicsButton.endFill();

		border = game.add.sprite(48*4+(37/53.0)*53*4, h - sh + (game.score.aniMenu?h:0) + 39*4+(12/2), 'border', null, this.imageGroup);
		border.scale.setTo(4, 4);
		border.smoothed = false;
		border.anchor.setTo(37/53.0, 0.5);
		border.angle = 0;
	
		graphicsUpgradButton = game.add.graphics(4, h + (game.score.aniMenu?sh:-sh) + 3*4);
    	graphicsUpgradButton.beginFill(0x727272);
    	graphicsUpgradButton.drawRect(0, 0, 39*4, 20*4);
    	graphicsUpgradButton.drawRect(39*4, 20*4-13*4, 5*4, 13*4);
		graphicsUpgradButton.endFill();
		graphicsUpgradButton.alpha = 0;

		b1 = game.add.bitmapText(510 + 110 - 76, (game.score.aniMenu?h:0) + 200 + 24 - 10, 'pixel_font_blue', 'launch', 22);
		b2 = game.add.bitmapText(5, (game.score.aniMenu?h:0) + 170, 'pixel_font', 'upgrade:' + (game.score.upgrad+1), 14);
		b3 = game.add.bitmapText(10, (game.score.aniMenu?h:0) + 200, 'pixel_font', game.score.killsToNextUpgrad()+' kills left', 10);

		fader = game.add.graphics(0, 0);
    	fader.beginFill(0x000000);
    	fader.drawRect(0, 0, game.width, game.height);
		fader.endFill();
		fader.alpha = 0;

		if(game.score.aniMenu)
		{
			this.tweenImage[0] = game.add.tween(sandhouse);
			this.tweenImage[0].to({ x: 0, y: h - sh }, 1000);
			this.tweenImage[0].start();

			// Too many this.tweenImages!!!
			this.tweenImage[1] = game.add.tween(border);
			this.tweenImage[1].to({ x: 48*4+(37/53.0)*53*4, y: h - sh + 39*4+(12/2) }, 1000);
			this.tweenImage[1].start();

			this.tweenImage[2] = game.add.tween(boat);
			this.tweenImage[2].to({ x: 48*4+(37/53.0)*53*4, y: h - sh + 18*4+(22*4*(1-(1.5 / 22))) }, 1000);
			this.tweenImage[2].start();

			this.tweenImage[3] = game.add.tween(graphicsButton);
			this.tweenImage[3].to({ x: 510, y: 200 }, 1000);
			this.tweenImage[3].start();

			this.tweenImage[4] = game.add.tween(graphicsUpgradButton);
			this.tweenImage[4].to({ x: 4, y: h - sh + 3*4 }, 1000);
			this.tweenImage[4].start();

			this.tweenImage[5] = game.add.tween(b1);
			this.tweenImage[5].to({ x: 510 + 110 - 76, y: 200 + 24 - 10 }, 1000);
			this.tweenImage[5].start();

			this.tweenImage[6] = game.add.tween(b2);
			this.tweenImage[6].to({ x: 8, y: 170 }, 1000);
			this.tweenImage[6].start();

			if(typeof b3 !== 'undefined')
			{
				this.tweenImage[7] = game.add.tween(b3);
				this.tweenImage[7].to({ x: 10, y: 205 }, 1000);
				this.tweenImage[7].start();
			}

			if(typeof b4 !== 'undefined')
			{
				this.tweenImage[8] = game.add.tween(b4);
				this.tweenImage[8].to({ x: 60, y: 200 }, 1000);
				this.tweenImage[8].start();
			}

			game.score.aniMenu = false;
		}

		this.launching = false;
		this.upgrads = false;
		this.upgradTime = game.time.now;

		thrust = game.add.audio('thrust');
		thrust.volume = 0.5;

		click = game.add.audio('click');
		click.volume = 0.4;		

		upga = game.add.audio('upgrade');
		upga.volume = 0.5;

	},
	update: function()
	{
		var mx = game.input.x;
		var my = game.input.y;

		if(!this.launching)
		{
			boat.animations.frame = game.score.upgrad*4;
			graphicsButton.alpha = 1.0 - Math.abs(Math.cos(game.time.now/300.0)/3.0);
			if(mx >= 510 && mx <= 730)
			{
				if(my >= 200 && my <= 248)
				{
					graphicsButton.alpha = 0.5;
					if(game.input.activePointer.isDown)
					{
						this.launch();
					}
				}
			}

			if(game.time.now > this.upgradTime)
			{
				this.upgrads = false;
			}
		}

		if(!this.upgrads && game.score.upgrad < 7)
		{
			graphicsUpgradButton.alpha = (game.score.killsToNextUpgrad() == 0) ? Math.abs(Math.cos(game.time.now/200.0)/2.0) : 0;
			if(mx >= 4 && mx <= 4 + 39*4 && game.score.killsToNextUpgrad() == 0)
			{
				if(my >= game.height - sandhouse.height + 3*4 && my <= game.height - sandhouse.height + 3*4 + 20*4)
				{
					graphicsUpgradButton.alpha = 1.0;
					if(game.input.activePointer.isDown)
					{
						this.upg();
					}
				}
			}
		}
	},
	upg: function()
	{
		if(game.score.sound)
		{
			click.play();
			upga.play();
		}
		
		this.upgrads = true;
		this.upgradTime = game.time.now + 500;
		game.score.upgrad++;
		boat.animations.frame = game.score.upgrad*4;

		upgradLabel.setText('+ ' + game.score.upgrads[game.score.upgrad]);
		upgradLabelT1 = game.add.tween(upgradLabel);
		upgradLabelT1.to({ alpha: 1.0 }, 500);
		upgradLabelT1.start();

		upgradLabelT2 = game.add.tween(upgradLabel);
		upgradLabelT2.delay(50+2000);
		upgradLabelT2.to({ alpha: 0.0 }, 500);
		upgradLabelT2.start();

		if(game.score.upgrad < 7)
		{	
			b3.setText(game.score.killsToNextUpgrad()+' kills left');
			b2.setText('upgrade:' + (game.score.upgrad+1));

		}
		else
		{
			b2.setText('upgrade:' + (game.score.upgrad+1));
			b3.x = 70;
			b3.setText('max');
		}
	},
	launch: function()
	{
		if(game.score.sound)
			click.play();

		this.launching = true;
		this.upgrads = true;


		tweenBorder = game.add.tween(border);
		tweenBorder.delay(500);
		tweenBorder.to({ angle: 45 }, 1000);
		tweenBorder.start();

		tweenBoat = game.add.tween(boat);
		tweenBoat.delay(500);
		tweenBoat.to({ angle: 45 }, 1000);
		tweenBoat.onComplete.add(this.fireShip);
		tweenBoat.start();

		var p = new Phaser.Point(boat.position.x, boat.position.y);
		var npos = p.rotate(boat.anchor.x, boat.anchor.y, Math.PI/4);

		tweenRelease = game.add.tween(boat);
		tweenRelease.delay(2000);
		tweenRelease.to({ x: boat.x + npos.x, y: boat.y + npos.y }, 1000);
		tweenRelease.start();

		tweenNextLevel = game.add.tween(fader);
		tweenNextLevel.delay(2800);
		tweenNextLevel.to({ alpha: 1.0 }, 1000);
		tweenNextLevel.onComplete.add(this.gameLevel);
		tweenNextLevel.start();
	},
	fireShip: function()
	{
		boat.animations.play('fire' + game.score.upgrad);
		if(game.score.sound)
			thrust.play();

	},
	gameLevel: function()
	{
		if(!game.score.controls)
			game.state.start('controls');
		else
			game.state.start('game');

	},
	shutdown: function()
	{
		if (tweenBorder) {
            tweenBorder.onComplete.removeAll();
            tweenBorder.stop();
            tweenBorder = null;
        }	

		if (tweenBoat) {
            tweenBoat.onComplete.removeAll();
            tweenBoat.stop();
            tweenBoat = null;
        }

        if (tweenRelease) {
            tweenRelease.onComplete.removeAll();
            tweenRelease.stop();
            tweenRelease = null;
        }	

		if (tweenNextLevel) {
            tweenNextLevel.onComplete.removeAll();
            tweenNextLevel.stop();
            tweenNextLevel = null;
        }	

		if (tween) {
            tween.onComplete.removeAll();
            tween.stop();
            tween = null;
        }

        for(var i = 0; i < 9; i++)
        {
			if (this.tweenImage[i]) {
	            this.tweenImage[i].onComplete.removeAll();
	            this.tweenImage[i].stop();
	            this.tweenImage[i] = null;
	        }
		}
	
        for(var i = 0; i < 7*4; i++)
        {
			if (this.tweenImageTile[i]) {
	            this.tweenImageTile[i].onComplete.removeAll();
	            this.tweenImageTile[i].stop();
	            this.tweenImageTile[i] = null;
	        }
	        this.tiles[i].kill();
		}


		boat.kill();
		border.kill();
		sandhouse.kill();

		if (graphicsButton.group)
		{
		   graphicsButton.group.remove(graphicsButton);
		}
		else if (graphicsButton.parent)
		{
		   graphicsButton.parent.removeChild(graphicsButton);
		}

		if (graphicsUpgradButton.group)
		{
		   graphicsUpgradButton.group.remove(graphicsUpgradButton);
		}
		else if (graphicsUpgradButton.parent)
		{
		   graphicsUpgradButton.parent.removeChild(graphicsUpgradButton);
		}

		gameLabel = null;
		b1 = null;
		b2 = null;
		b3 = null;
		b4 = null;

	}/*,
	shutdown: function()
	{

		if (tweenBorder) {
            tweenBorder.onComplete.removeAll();
            tweenBorder.stop();
            tweenBorder = null;
        }	

		if (tweenBoat) {
            tweenBoat.onComplete.removeAll();
            tweenBoat.stop();
            tweenBoat = null;
        }

        if (tweenRelease) {
            tweenRelease.onComplete.removeAll();
            tweenRelease.stop();
            tweenRelease = null;
        }	

		if (tweenNextLevel) {
            tweenNextLevel.onComplete.removeAll();
            tweenNextLevel.stop();
            tweenNextLevel = null;
        }	

		if (tween) {
            tween.onComplete.removeAll();
            tween.stop();
            tween = null;
        }

        for(var i = 0; i < 9; i++)
        {
			if (this.tweenImage[i]) {
	            this.tweenImage[i].onComplete.removeAll();
	            this.tweenImage[i].stop();
	            this.tweenImage[i] = null;
	        }
		}
	
        for(var i = 0; i < 7*4; i++)
        {
			if (this.tweenImageTile[i]) {
	            this.tweenImageTile[i].onComplete.removeAll();
	            this.tweenImageTile[i].stop();
	            this.tweenImageTile[i] = null;
	        }

	        Phaser.Sprite.call(this.tiles[i], "destory", true);
	        //console.log(Phaser.Sprite.prototype);
		}

		//this.imageGroup.removeAll(true);
		Phaser.Graphics.call(graphicsButton, "destory", true);
		Phaser.Graphics.call(graphicsUpgradButton, "destory", true);
		Phaser.Sprite.call(boat, "destory", true);
		Phaser.Sprite.call(border, "destory", true);
		Phaser.Sprite.call(sandhouse, "destory", true);

		gameLabel = null;
		b1 = null;
		b2 = null;
		b3 = null;
		b4 = null;
	}*/
};
