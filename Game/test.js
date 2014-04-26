/*
*
*  Julgodis 2014
*  test.js
*
*/

var Test = function (game) { };
Test.prototype = 
{
	create: function()
	{
		game.world.setBounds(-2000, -2000, 4000, 4000);
		background = game.add.tileSprite(0, 0, 800, 600, 'background');
		background.scale.set(1, 1);
		background.smoothed = false;
		background.fixedToCamera = true;

		player = new Player(game);

		player.sprite = game.add.sprite(20, 20, 'ship');
		//player.sprite.scale.setTo(0.05, 0.05); // Until the graphics is done!
		player.sprite.scale.setTo(player.scale, player.scale);
		player.sprite.anchor.setTo(0.5, 0.5);
		player.sprite.smoothed = false;

		game.physics.enable(player.sprite, Phaser.Physics.ARCADE);
    	player.sprite.body.drag.set(0.1);
    	player.sprite.body.maxVelocity.setTo(600, 600);
    	player.sprite.body.collideWorldBounds = true;


		this.missileGroup = game.add.group();
		this.explosionGroup = game.add.group();
		this.bulletGroup = game.add.group();
		this.enemies = game.add.group();
		this.circels = game.add.group();

		this.missileGroup.enableBody = true;
    	this.missileGroup.physicsBodyType = Phaser.Physics.ARCADE;

		this.bulletGroup.enableBody = true;
    	this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

    	this.enemies.enableBody = true;
    	this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

		for(var i = 0; i < 1; i++)
		{
			var enemy = new Enemy(game, game.rnd.integerInRange(100, 100), game.rnd.integerInRange(100, 100), 0, player);
			enemy.revive();
			this.enemies.add(enemy);
		}


    	filter = game.add.filter('Water', 800, 600);
		filter.alpha = 0.2;

		backgroundFilter = game.add.sprite(-400, -300);
		backgroundFilter.width = 800;
		backgroundFilter.height = 600;
		backgroundFilter.isFixedCamera = true;
		backgroundFilter.filters = [filter];


		game.camera.follow(player.sprite);
    	game.camera.deadzone = new Phaser.Rectangle(200, 200, 400, 200);
    	game.camera.focusOnXY(0, 0);

    	var overscreen = game.add.tileSprite(0, 0, 800, 600, 'overscreen');
    	overscreen.fixedToCamera = true;

    	game.time.advancedTiming = true;
    	this.fpsText = this.game.add.text(20, 20, '', { font: '16px Arial', fill: '#ffffff' } );
    	this.fpsText.fixedToCamera = true;
	},
	update: function()
	{
		if (this.game.time.fps !== 0) {
		    this.fpsText.setText(this.game.time.fps + ' FPS');
		}

		game.physics.arcade.overlap(this.bulletGroup, this.enemies, this.collisionBulletToEnemy, null, this);
		game.physics.arcade.overlap(this.explosionGroup, this.enemies, this.collisionMissileToEnemy, null, this);
		player.rotateToMouse(game.input.x, game.input.y);

		if(game.input.keyboard.isDown(Phaser.Keyboard.A))
		{
			player.moveX(-1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D))
		{
			player.moveX(1);
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.W))
		{
			player.moveY(-1);
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S))
		{
			player.moveY(1);
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			player.fireMissiles(this);
		}

		if(game.input.activePointer.isDown)
		{
			player.fireBullets(this);
		}

		player.update();
		
		background.tilePosition.x = -game.camera.x;
		background.tilePosition.y = -game.camera.y;

		backgroundFilter.position.x = game.camera.x;
		backgroundFilter.position.y = game.camera.y;
		filter.offset.x = game.camera.x;
		filter.offset.y = -game.camera.y;
		filter.update();

		this.missileGroup.forEachAlive(function(m) {
	        var distance = this.game.math.distance(m.x, m.y, m.target_object.x, m.target_object.y);
	        if (distance < 30) {
	            m.kill();
	            this.createExplosion(m, m.x, m.y);
	        }
	    }, this);
	},
	collisionBulletToEnemy: function (bullet, enemy) {
		bullet.kill();
		enemy.damage(bullet);
	},
	collisionMissileToEnemy: function (ex, enemy) {
		if(ex.doDamage)
			enemy.damageToExplosion(ex);
	},
	render: function()
	{
		/*this.bulletGroup.forEachAlive(function(m) {
	        game.debug.body(m);
	    }, this);

		this.enemies.forEachAlive(function(m) {
	        game.debug.body(m);
	    }, this);

	    game.debug.text("Bullets alive: " + this.bulletGroup.countLiving(), 28, 60);
	    game.debug.text("Explosions alive: " + this.explosionGroup.countLiving(), 28, 60+30);
	    game.debug.text("Enemies alive: " + this.enemies.countLiving(), 28, 60+60);*/

		/*{
			var point1 = new Phaser.Point(10*player.scale-4, -12*player.scale);
			var point2 = new Phaser.Point(-10*player.scale+4, -12*player.scale);

			var angle1 = Math.atan2(point1.y, point1.x);
			var angle2 = Math.atan2(point2.y, point2.x);

			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			game.debug.geom(new Phaser.Circle(player.sprite.x + 0 + r1.x, player.sprite.y + 0 + r1.y, 5), '#cfffff');
			game.debug.geom(new Phaser.Circle(player.sprite.x + 0 + r2.x, player.sprite.y + 0 + r2.y, 5), '#cfcfff');
		}

		{
			var point1 = new Phaser.Point(3*player.scale-2, -12*player.scale);
			var point2 = new Phaser.Point(-3*player.scale+2, -12*player.scale);

			var angle1 = Math.atan2(point1.y, point1.x);
			var angle2 = Math.atan2(point2.y, point2.x);

			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			game.debug.geom(new Phaser.Circle(player.sprite.x + 0 + r1.x, player.sprite.y + 0 + r1.y, 5), '#0fffcf');
			game.debug.geom(new Phaser.Circle(player.sprite.x + 0 + r2.x, player.sprite.y + 0 + r2.y, 5), '#0fcfcf');
		}

		{
			var point1 = new Phaser.Point(6*player.scale-2, -4*player.scale);
			var point2 = new Phaser.Point(-6*player.scale+2, -4*player.scale);

			var angle1 = Math.atan2(point1.y, point1.x);
			var angle2 = Math.atan2(point2.y, point2.x);

			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			game.debug.geom(new Phaser.Circle(player.sprite.x + 0 + r1.x, player.sprite.y + 0 + r1.y, 5), '#cfffcf');
			game.debug.geom(new Phaser.Circle(player.sprite.x + 0 + r2.x, player.sprite.y + 0 + r2.y, 5), '#cfcfcf');
		}*/
	},
	createExplosion:  function(missile, x, y) {
	    var explosion = this.explosionGroup.getFirstDead();

	    if (explosion === null) {
	        explosion = game.add.sprite(0, 0, 'explosion');
	        explosion.anchor.setTo(0.5, 0.5);
	        this.game.physics.enable(explosion, Phaser.Physics.ARCADE);

	        var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
	        animation.killOnComplete = true;

	        this.explosionGroup.add(explosion);
	    }

	    explosion.revive();

	    explosion.x = x;
	    explosion.y = y;
	    explosion.doDamage = true;
	    explosion.damage = missile.damage();

	    explosion.angle = game.rnd.integerInRange(0, 360);

	    explosion.animations.play('boom');
	    return explosion;
	}

};

