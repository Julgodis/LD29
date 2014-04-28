/*
*
*  Julgodis 2014
*  water_scene.js
*
*/

var WaterEffect = function (game) { };
WaterEffect.prototype = 
{
	// Not needed, everythings is already loaded!
	//preload: function() {} 

	create: function()
	{
		game.world.setBounds(0, 0, 4000, 4000);
		filter = game.add.filter('Water', game.width, game.height);
		filter.alpha = 0.2;

		this.group = game.add.group();
    	backgroundFilter = game.add.sprite(0, 0, 'background', null, this.group);
		backgroundFilter.width = game.width;
		backgroundFilter.height = game.height;
		backgroundFilter.isFixedCamera = true;
		backgroundFilter.filters = [ filter ];

    	player = new Player(game);
    	player.level = game.score.upgrad;
    	player.group = game.add.group(this.group);

		player.sprite = game.add.sprite(100, 100, 'ship', null, player.group);
		//player.sprite.scale.setTo(0.05, 0.05); // Until the graphics is done!
		player.sprite.scale.setTo(player.scale, player.scale);
		player.sprite.anchor.setTo(0.5, 0.5);
		player.sprite.smoothed = false;

		for(var i = 0; i < 8; i++)
		{
			player.sprite.animations.add('move' + i, [0+i*4,1+i*4,2+i*4,3+i*4], 60, false);
		}

		game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    	player.sprite.body.drag.set(0.1);
    	player.sprite.body.maxVelocity.setTo(game.width, game.height);
    	player.sprite.body.collideWorldBounds = true;
    	player.init();
    	player.sprite.body.velocity.x = 1000;
    	player.sprite.body.velocity.y = 1000;

    	this.missileGroup = game.add.group(this.group);
		this.explosionGroup = game.add.group(this.group);
		this.bulletGroup = game.add.group(this.group);
		this.enemies = game.add.group(this.group);
		this.circels = game.add.group(this.group);

		this.missileGroup.enableBody = true;
    	this.missileGroup.physicsBodyType = Phaser.Physics.ARCADE;

		this.bulletGroup.enableBody = true;
    	this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

    	this.enemies.enableBody = true;
    	this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

		for(var i = 0; i < this.getMaxSpawn(0); i++)
		{
			var enemy = new Enemy(game, game.rnd.integerInRange(800, 3800), game.rnd.integerInRange(600, 3800), 0, player, this);
			enemy.revive();
			this.enemies.add(enemy);
		}

		for(var i = 0; i < this.getMaxSpawn(1); i++)
		{
			var enemy = new Enemy(game, game.rnd.integerInRange(800, 3800), game.rnd.integerInRange(600, 3800), 1, player, this);
			enemy.revive();
			this.enemies.add(enemy);
		}

		for(var i = 0; i < this.getMaxSpawn(2); i++)
		{
			var enemy = new Enemy(game, game.rnd.integerInRange(800, 3800), game.rnd.integerInRange(600, 3800), 2, player, this);
			enemy.revive();
			this.enemies.add(enemy);
		}


		filterOver = game.add.filter('WaterForeground', game.width, game.height);
		filterOver.alpha = 0.2;

    	foregroundFilter = game.add.sprite(0, 0, 'background', null, this.group);
		foregroundFilter.width = game.width;
		foregroundFilter.height = game.height;
		foregroundFilter.isFixedCamera = true;
                
                if(game.score.detail <= 1)
                    foregroundFilter.filters = [ filterOver ];
                    else
                    foreground.Filter.alpha = 0;

		var displacementTexture = PIXI.Texture.fromImage("assets/displacement_map.jpg");
    	this.displacementFilter = new PIXI.DisplacementFilter(displacementTexture);
    	this.displacementFilter.scale.x = -30;
		this.displacementFilter.scale.y = 30;
    	count = 0;

    	this.pixelateFilter = new PIXI.PixelateFilter();
    	this.pixelateFilter.size.x = 3;
    	this.pixelateFilter.size.y = 3;

    	if(game.score.detail == 0) 
    		this.group.filters = [ this.displacementFilter/*, this.pixelateFilter*/ ];
    	else if(game.score.detail == 1)
    		this.group.filters = [ this.pixelateFilter ];
        
    	game.camera.follow(player.sprite);
    	//game.camera.deadzone = new Phaser.Rectangle(game.width / 3, game.height / 3, game.width / 3, game.height / 3);
    	game.camera.focusOnXY(0, 0);
    	
    	hp1 = game.add.sprite(0, game.height - 6*8, 'hp_green');
    	hp1.scale.setTo(8, 8);
    	hp1.smoothed = false;
    	hp1.fixedToCamera = true;

    	hp2 = game.add.sprite(hp1.width - 2*8, game.height - 4*8, 'hp_red');
    	hp2.scale.setTo(0, 8);
    	hp2.smoothed = false;
    	hp2.fixedToCamera = true;

    	over = game.add.sprite(0, 0, 'overscreen');
    	over.fixedToCamera = true;
    	over.scale.setTo(8, 8);
    	over.smoothed = false;

		damageIndicator = game.add.graphics(0, 0);
    	damageIndicator.beginFill(0xFF0000);
    	damageIndicator.drawRect(0, 0, game.width, game.height);
		damageIndicator.endFill();
		damageIndicator.alpha = 0;
		damageIndicator.fixedToCamera = true;

		damageTween = game.add.tween(damageIndicator);

		fader = game.add.graphics(0, 0);
    	fader.beginFill(0x000000);
    	fader.drawRect(0, 0, game.width, game.height);
		fader.endFill();
		fader.alpha = 1;
		fader.fixedToCamera = true;

		tweenStartGame = game.add.tween(fader);
		tweenStartGame.to({ alpha: 0.0 }, 1000);
		tweenStartGame.onComplete.add(this.startGame);
		tweenStartGame.start();

		spawnCycle = 5000;
		spawnCycleNext = game.time.now + spawnCycle;

		game.time.advancedTiming = true;
    	this.fpsText = game.add.bitmapText(20, 20, 'pixel_font', 'FPS', 20);
    	this.fpsText.fixedToCamera = true;

    	this.killText = game.add.bitmapText(20, game.height - 8*(10) - 24, 'pixel_font', 'Kills: 0', 8);
    	this.killText.fixedToCamera = true;    	
    	this.killtText = game.add.bitmapText(20, game.height - 8*(9), 'pixel_font', 'Kills to next upgrad: 0', 8);
    	this.killtText.fixedToCamera = true;

    	this.killHelp = game.add.bitmapText(20 + 00, game.height - 8*(9)-12, 'pixel_font', '[You can only upgrade over sea!]', 6);
    	this.killHelp.fixedToCamera = true;    

    	game.score.waitForStart = true;
    	game.score.current_state = this;
    	game.score.gamePlayer = player;

    	this.canMove = false;
    	this.gameOverTween = false;

    	this.boom = game.add.audio('boom');
    	this.boom.volume = 0.5;
	},
	shutdown: function()
	{
		game.score.gameOver = false;

		if (tweenStartGame) {
            tweenStartGame.onComplete.removeAll();
            tweenStartGame.stop();
            tweenStartGame = null;
        }	

        if (damageTween) {
            damageTween.onComplete.removeAll();
            damageTween.stop();
            damageTween = null;
        }	

        if (damageIndicator.group)
		{
		   damageIndicator.group.remove(damageIndicator);
		}
		else if (damageIndicator.parent)
		{
		   damageIndicator.parent.removeChild(damageIndicator);
		}

		foregroundFilter.kill();
		backgroundFilter.kill();

		this.missileGroup.callAll('killAll');
		this.bulletGroup.callAll('killAll');
		this.enemies.callAll('kill');
		this.circels.callAll('kill');
		this.explosionGroup.callAll('kill');

        player.killAll();
        this.fpsText = null;

        this.canMove = false;
    	this.gameOverTween = false;
    	game.score.waitForStart = true;
    	game.score.current_state = null;
    	game.score.gamePlayer = null;
	},
	startGame: function()
	{
		game.score.current_state.canMove = true;
	},
	endGame: function()
	{
		game.state.start('dead');
	},
	getMaxSpawn: function(type)
	{
		if(type == 0)
		{
			var n1 = this.getMaxSpawn(1);
			var n2 = this.getMaxSpawn(2);

			var n = game.score.gameLevel * 18;
			n -= (n1+3) * 2;
			n -= n2 * 10;

			// n = x * 10 - (x * 2 * 5) - (x * 0.1 * 10);

			return Math.floor(n);
		}
		else if(type == 1)
		{
			var n2 = this.getMaxSpawn(2);

			var n = (game.score.gameLevel - 0.5) * 6 - 3;
			n -= n2 * 5;

			return Math.floor(n);
		}
		else if(type == 2)
		{
			var n = (game.score.gameLevel - 0.5) * 0.9;
			return Math.floor(n);
		}

		return 0;
	},
	spawnEnemy: function(type)
	{
		var enemy = this.enemies.getFirstDead();

		var xx = game.rnd.integerInRange(100, 3900);
		var yy = game.rnd.integerInRange(100, 3900);

		var g = 0;
		while(game.math.distance(player.x, player.y, xx, yy) <= Math.sqrt(900*900 + 700*700))
		{
			xx = game.rnd.integerInRange(100, 3800);
			yy = game.rnd.integerInRange(100, 3800);
			g++;

			// fix infinity loop
			if(g > 100)
				return;
		}

		if(enemy == null)
		{
			enemy = new Enemy(game, xx, yy, type, player, this);
			this.enemies.add(enemy);
		}

		enemy.revive();

		enemy.x = xx;
		enemy.y = yy;
		enemy.type = type;
	},
	update: function()
	{
		if(game.score.gameOver && !this.gameOverTween)
		{
			this.gameOverTween = true;

			var tweenNextLevel = game.add.tween(fader);
			tweenNextLevel.to({ alpha: 1.0 }, 1000);
			tweenNextLevel.onComplete.add(this.endGame);
			tweenNextLevel.start();
		}

		if(game.score.gameOver)
			{ return; }

		if (this.game.time.fps !== 0) {
		    this.fpsText.setText(this.game.time.fps + ' FPS');
		}		

		this.killtText.setText('Kills to next upgarde: ' + game.score.killsToNextUpgrad());
		this.killHelp.alpha = game.score.killsToNextUpgrad() == 0 ? 1 : 0;
		this.killText.setText('Kills: ' + game.score.kills);
		game.score.gameLevel += 0.00002;
		//game.score.gameLevel += 0.001;

		if(game.time.now > spawnCycleNext)
		{
			var es = [0, 0, 0];

			this.enemies.forEachAlive(function(m) {
				if(m.alive)
		       		es[m.type]++;
		    }, this);

		    for(var i = 0; i < 3; i++)
		    {
		    	var s = this.getMaxSpawn(i);
		    	if(es[i] < s)
		    	{
		    		for(var j = 0; j < s - es[i]; j++)
		    		{
		    			this.spawnEnemy(i);
		    		}


		    	}
		    }

		    spawnCycleNext = game.time.now + spawnCycle;
		}

		game.physics.arcade.overlap(this.bulletGroup, this.enemies, this.collisionBulletToEnemy, null, this);
		game.physics.arcade.overlap(this.explosionGroup, this.enemies, this.collisionMissileToEnemy, null, this);

		game.physics.arcade.overlap(this.bulletGroup, player.sprite, this.collisionBulletToPlayer, null, this);
		game.physics.arcade.overlap(this.explosionGroup, player.sprite, this.collisionMissileToPlayer, null, this);

		this.missileGroup.forEachAlive(function(m) {
	        var distance = this.game.math.distance(m.x, m.y, m.target_object.x, m.target_object.y);
	        if (distance < 30 || m.life <= 0) {
	        	this.boom.play();
	            m.killAll();
	            this.createExplosion(m, m.x, m.y);
	        }
	    }, this);

		count += 0.1;
		this.displacementFilter.offset.x = count * 10 + game.camera.x;
		this.displacementFilter.offset.y = -count * 10 - game.camera.y;

		filterOver.offset.x = count * 2 + game.camera.x;
		filterOver.offset.y = -count * 2 - game.camera.y;
		filterOver.update();

		if(Math.abs(game.camera.x/2 - filter.offset.x) >= 5 || Math.abs(-game.camera.y/2 - filter.offset.y) >= 5)
		{
			filter.offset.x = game.camera.x/2;
			filter.offset.y = -game.camera.y/2;
			filter.update();
		}

		player.rotateToMouse(game.input.x, game.input.y);
		if(game.input.keyboard.isDown(Phaser.Keyboard.A) && this.canMove)
		{
			game.score.waitForStart = false;
			player.moveX(-1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D) && this.canMove)
		{
			game.score.waitForStart = false;
			player.moveX(1);
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.W) && this.canMove)
		{
			game.score.waitForStart = false;
			player.moveY(-1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S) && this.canMove)
		{
			game.score.waitForStart = false;
			player.moveY(1);
		}

		if((game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.isDown(Phaser.Keyboard.B)) && this.canMove)
		{
			game.score.waitForStart = false;
			player.fireMissiles(this);
		}

		if(game.input.activePointer.isDown && this.canMove)
		{
			game.score.waitForStart = false;
			player.fireBullets(this);
		}

		if(player.life > 0)
		{
			var f = 1 - player.life/player.maxLife;
			f *= 32;
			f = Math.floor(f)/32.0;
			hp2.scale.setTo(-8*f, 8);
		}
		else
			hp2.scale.setTo(-8, 8);

		player.update();

		//displacementFilter.update();
	},
	damageToPlayer: function() {
		if(!damageTween.isRunning)
		{
			damageIndicator.alpha = 0.6;
			damageTween.to({ alpha: 0.0 }, 500);
			damageTween.start();
		}
	},
	collisionBulletToEnemy: function (bullet, enemy) {
		if(bullet.type != 0)
			return;

		bullet.killAll();
		enemy.damage(bullet);
	},
	collisionMissileToEnemy: function (ex, enemy) {
		if(ex.type == 0)
		{
			enemy.damageToExplosion(ex);
		}
	},
	collisionBulletToPlayer: function (_player, bullet) {
		if(bullet.type != 1)
			return;

		bullet.killAll();
		player.damage(bullet);
	},
	collisionMissileToPlayer: function (_player, ex) {
		if(ex.type == 1)
		{
			player.damageToExplosion(ex);
		}
	},
	createExplosion:  function(missile, x, y) {
	    var explosion = this.explosionGroup.getFirstDead();

	    if (explosion == null) {
	        explosion = game.add.sprite(0, 0, 'explosion');
	        explosion.anchor.setTo(0.5, 0.5);
	        explosion.scale.setTo(4, 4);
	        explosion.smoothed = false;
	        explosion.type = missile.type;
	     	explosion.damage = missile.total_damage();
	        this.game.physics.enable(explosion, Phaser.Physics.ARCADE);

	        var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
	        animation.killOnComplete = true;

	        this.explosionGroup.add(explosion);
	    }

	    explosion.revive();

	    explosion.x = x;
	    explosion.y = y;
	    explosion.doDamage = true;
	    explosion.type = missile.type;
	    explosion.damage = missile.total_damage();

	    explosion.angle = game.rnd.integerInRange(0, 360);

	    explosion.animations.play('boom');
	    return explosion;
	}
};
