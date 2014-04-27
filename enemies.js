/*
*
*  Julgodis 2014
*  enemies.js
*
*/


var Enemy = function(game, x, y, t, target, state)
{
	Phaser.Sprite.call(this, game, x, y, 'enemy_'+t);
	this.scale.setTo(2, 2);
	this.anchor.setTo(0.5, 0.5);

	this.smoothed = false;
	this.target = target;

	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.drag.set(0.1);
	this.body.maxVelocity.setTo(600, 600);
	this.body.collideWorldBounds = true;
	this.body.setSize(20, 16, 0, 0);

	this.animations.add('move', [0, 1, 2, 3], 15, false);
	this.ani

	this.speed = 0;
	this.type = t;
	this.oldType = -1;
	this.life = 100;

	this.bulletCd = 400.0;
	this.bulletNextFire = 0;
	this.maxSpeed = 320;
	this.state = state;
	this.wasDead = false;

	this.type2_missileCd = 1500;
	this.type2_missileNextFire = 1000;

	shoot = game.add.audio('shot');
	shoot.volume = 0.2;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() 
{
	if (!this.alive || game.score.waitForStart) 
	{
        return;
    } 

    if(this.type != this.oldType || this.wasDead)
    {
    	this.wasDead = false;
    	this.oldType = this.type;
    	this.loadTexture('enemy_'+this.type);

    	this.body.setSize(20, 16, 0, 0);
    	this.life = 50 + 50 * game.score.gameLevel;

		this.bulletCd = 400.0 - 20 * game.score.gameLevel;
		this.bulletNextFire = 0;
		this.maxSpeed = 320;


		if(this.type == 1)
		{
			this.body.setSize(20, 16, 0, 0);
    		this.life = 5 + 50 * game.score.gameLevel;
			this.maxSpeed = 450;

			this.bulletCd = 300.0 - 20 * game.score.gameLevel;
			this.bulletNextFire = 0;
		}
		else if(this.type == 2) // kinda boss
		{
			this.body.setSize(20, 16, 0, 0);
    		this.life = 280;
			this.maxSpeed = 175 + 75 * game.score.gameLevel;

			this.bulletCd = 200.0 - 20 * game.score.gameLevel;
			this.bulletNextFire = 0;
		}
    }

    this.speed *= 0.98;
    var moveAway = 1;
	var distance = game.math.distance(this.x, this.y, this.target.x, this.target.y);
    if(distance >= 200 && distance < 1000)
    {
    	this.speed = (distance/2 + 200);
    	if(this.speed > this.maxSpeed)
    		this.speed = this.maxSpeed;

    }
    else if(distance <= 50)
    {
    	moveAway = -1;
    	this.speed = 120 - distance;
    }
    else if(distance >= 1000)
    {
    	this.speed = game.rnd.integerInRange(200, this.maxSpeed-10);
    }

    var dx = this.x - (this.target.x + (this.target.sprite.body.velocity.x * 0.2));
	var dy = this.y - (this.target.y + (this.target.sprite.body.velocity.y * 0.2));
	var angle = Math.atan2(dy, dx) * moveAway;

	if(distance > 1500)
    {
    	angle = (this.angle + game.rnd.angle()/3) * (Math.PI/180);
    }

	var aa = angle * (180/Math.PI);

	var avoidAngle = 0;
    this.parent.forEachAlive(function(m) {
        if (this == m) return;
        if (avoidAngle !== 0) return;

        var distance = this.game.math.distance(this.x, this.y, m.x, m.y);
        if (distance < 30 && this.game.math.chanceRoll(50)) {
            avoidAngle = (Math.PI/2) * (game.rnd.angle()/180) + 80;

            this.speed += (distance/4 + 10) + 200 * Math.abs(game.rnd.angle()/180);
           	if(this.speed > this.maxSpeed)
    			this.speed = this.maxSpeed;
            if (this.game.math.chanceRoll(50)) avoidAngle *= -1;
        }
    }, this);

    aa += avoidAngle;

	if(this.angle !== aa)
	{
		var delta = aa - this.angle;
		if(delta > Math.PI) delta -= Math.PI*2;
		if(delta < -Math.PI) delta += Math.PI*2;

		if(delta > 0) this.angle += 5;
		else this.angle -= 5;

		if(Math.abs(delta) < this.game.math.degToRad(5))
			this.angle = aa;
	}

    if(distance <= 450 && avoidAngle <= 0)
    {

		if(game.time.now > this.bulletNextFire)
		{
			if(game.score.sound)
				shoot.play();
			this.bulletNextFire = game.time.now + this.bulletCd;

			var force = 10 * 1;

			var point1 = new Phaser.Point(0, 12*4);
			var angle1 = Math.atan2(point1.y, point1.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/22);
			var r1 = point1.rotate(0, 0, angle1 + this.angle * (Math.PI/180) + Math.PI/2);

			this.launchBullet(this.state, this.x + r1.x, this.y + r1.y);

			this.body.velocity.x -= Math.cos(this.angle * (Math.PI/180)) * force;
			this.body.velocity.y -= Math.sin(this.angle * (Math.PI/180)) * force;

			//game.add.existing(new Missile(game, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle, { x: 100.0, y: 100 }));
			//game.add.existing(new Missile(game, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle, { x: 100.0, y: 100 }));

		}

    }

    if(distance <= 950 && avoidAngle <= 0 && this.type == 2)
    {

		if(game.time.now > this.type2_missileNextFire)
		{
			if(game.score.sound)
				shoot.play();
			this.type2_missileNextFire = game.time.now + this.type2_missileCd;

			var force = 20 * 3;

			var point1 = new Phaser.Point(-3*4, 3*4);
			var point2 = new Phaser.Point(0, 3*4);
			var point3 = new Phaser.Point(3*4, 3*4, 0);

			var angle1 = Math.atan2(point1.y, point1.x);
			var angle2 = Math.atan2(point2.y, point2.x);
			var angle3 = Math.atan2(point3.y, point3.x);

			var r1 = point1.rotate(0, 0, angle1 + this.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + this.angle * (Math.PI/180) + Math.PI/2);
			var r3 = point3.rotate(0, 0, angle3 + this.angle * (Math.PI/180) + Math.PI/2);

			this.launchMissile(this.state, this.x + r1.x, this.y + r1.y, game.score.gamePlayer);
			this.launchMissile(this.state, this.x + r2.x, this.y + r2.y, game.score.gamePlayer);
			this.launchMissile(this.state, this.x + r3.x, this.y + r3.y, game.score.gamePlayer);

			this.body.velocity.x -= Math.cos(this.angle * (Math.PI/180)) * force;
			this.body.velocity.y -= Math.sin(this.angle * (Math.PI/180)) * force;

			//game.add.existing(new Missile(game, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle, { x: 100.0, y: 100 }));
			//game.add.existing(new Missile(game, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle, { x: 100.0, y: 100 }));

		}

    }


    this.body.velocity.x = Math.cos(this.angle * (Math.PI/180) + Math.PI) * this.speed;
    this.body.velocity.y = Math.sin(this.angle * (Math.PI/180) + Math.PI) * this.speed;

	if(game.math.distance(this.body.velocity.x, this.body.velocity.y, 0, 0) > 50)
		this.play('move');
	else
		this.animations.frame = 0;
}

Enemy.prototype.launchBullet = function(state, x, y)
{
	var bullet = state.bulletGroup.getFirstDead();

	if(bullet == null && state.bulletGroup.children.length > 50)
		return;

	var isNew = false;
	if(bullet === null)
	{
		bullet = new Bullet(game, x, y, this.angle + 180, 1, state);
		state.bulletGroup.add(bullet);
		isNew = true;
	}

	bullet.revive();
	bullet.x = x;
	bullet.y = y;
	bullet.particels();
	bullet.life = 200;
	if(!isNew)
		bullet.type = 1;
	bullet.body.velocity.x += this.body.velocity.x*5;
	bullet.body.velocity.y += this.body.velocity.y*5;
	this.addCircle(state, x, y, 0.5);

	bullet.rotation = this.angle * (Math.PI / 180) + Math.PI;
	bullet.angle = this.angle + 180;

	return bullet;
};

Enemy.prototype.launchMissile = function(state, x, y, target)
{
	var missile = state.missileGroup.getFirstDead();

	if(missile == null && state.missileGroup.children.length > 30)
		return;

    if (missile === null) 
    {
        missile = new Missile(game, x, y, this.angle + Math.PI, target, 1, state);
        state.missileGroup.add(missile);
    }

    missile.revive();

    missile.life = missile.maxLife;
    missile.particels();
	missile.x = x;
	missile.y = y;
	missile.type = 1;
	this.addCircle(state, x, y, 0.6);

	missile.rotation = this.angle * (Math.PI/180) + Math.PI;
	missile.angle = this.angle;

	missile.target_object = target;

	return missile;
};

Enemy.prototype.addCircle = function(state, x, y, s)
{
	var circle = state.circels.getFirstDead();

    if (circle === null) 
    {
    	circle = new FireCircle(game, x, y, 0.5);
		state.circels.add(circle);
	}

	circle.revive();
	circle.x = x;
	circle.y = y;
	circle.scale.setTo(s, s);
	circle.maxScale = s;
	circle.tick = 10;
	   circle.alpha = 0.5;
	circle.deltaScale = ((s-0.2)/circle.tick);

	return circle;
};

Enemy.prototype.damage = function(bullet) {
	this.life -= bullet.damage();

	if(this.life <= 0)
	{
		this.wasDead = true;
		this.kill();
		game.score.gameScore += 10;
		game.score.kills++;
		if(this.type == 1)
		{
			game.score.gameScore += 1;
		}
		else if(this.type == 2)
		{
			game.score.gameScore += 3;
		}
	}
};

Enemy.prototype.damageToExplosion = function(ex) {
	this.life -= ex.damage;
	ex.doDamage = false;

	if(this.life <= 0)
	{
		this.wasDead = true;
		this.kill();
		game.score.gameScore += 10;
		game.score.kills++;
		if(this.type == 1)
		{
			game.score.gameScore += 1;
		}
		else if(this.type == 2)
		{
			game.score.gameScore += 3;
		}
	}
};

