/*
*
*  Julgodis 2014
*  player.js
*
*/

var Player = function(game) { };

Player.prototype = 
{
	speed: 7.2,
	missileCd: 1500.0,
	missileNextFire: 0,

	bulletCd: 250.0,
	bulletNextFire: 0,

	agCd: 400.0,
	agNextFire: 0,

	scale: 2,
	level: 7, 

	life: 100,
	maxLife: 100,

	autogun: null,
	group: null,
	thrusters: 0,

	init: function()
	{
		this.sprite.revive();
		this.maxLife = 100 + (this.level - 1) * (300/7);
		this.life = this.maxLife;

		if(this.level >= 5)
		{
			this.autogun = game.add.sprite(0, 0, 'autogun', null, this.group);
			this.autogun.anchor.setTo(.5, .5);
			this.autogun.smoothed = false;
			this.autogun.scale.setTo(this.scale+1, this.scale+1);

		}

		thrust = game.add.audio('thrust');
		thrust.volume = 0.05;

		shoot = game.add.audio('shot');
		shoot.volume = 1;
	},

	moveX: function(direction)
	{
		this.sprite.body.velocity.x += direction * this.speed;
	},
	moveY: function(direction)
	{
		this.sprite.body.velocity.y += direction * this.speed;
	},

	rotateToMouse: function(x, y)
	{
		var dx = this.sprite.x - (x + game.camera.x);
		var dy = this.sprite.y - (y + game.camera.y);
		var angle = Math.atan2(dy, dx); 
		this.sprite.angle = angle * (180 / Math.PI) + 180;
	},

	update: function()
	{

		if(this.autogun != null)
		{
			var point1 = new Phaser.Point(0, -8*this.scale);
			var angle1 = Math.atan2(point1.y, point1.x);
			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			this.autogun.x = this.sprite.x + r1.x;
			this.autogun.y = this.sprite.y + r1.y;

			var t = null;
			var dist = 500;
			game.score.current_state.enemies.forEachAlive(function(m) {
		        var distance = game.math.distance(m.x, m.y, this.autogun.x, this.autogun.y);
		        if (distance < dist) {
		            t = m;
		            dist = distance;
		        }
		    }, this);

			if(t !== null)
			{
				var dx = this.autogun.x - (t.x + (t.body.velocity.x * 0.5));
				var dy = this.autogun.y - (t.y + (t.body.velocity.y * 0.5));
				var angle = Math.atan2(dy, dx);
				this.autogun.angle = angle * (180/Math.PI) + 180;

				if(game.time.now > this.agNextFire)
				{
					this.agNextFire = game.time.now + this.agCd;

					this.launchBullet(game.score.current_state, this.sprite.x + r1.x, this.sprite.y + r1.y, this.autogun.angle);

					this.sprite.body.velocity.x -= Math.cos(this.sprite.angle * (Math.PI/180)) * 10;
					this.sprite.body.velocity.y -= Math.sin(this.sprite.angle * (Math.PI/180)) * 10;
				}	
			}
		}

		if (!this.sprite.alive) 
		{
			if(this.smokeEmitter != null)
	        	this.smokeEmitter.on = false;
	        return;
	    } 

	    if(this.level >= 3)
	    	this.bulletCd = 150;
	    else
	    	this.bulletCd = 250;
	    
    	if(this.level >= 4)
    		this.speed = 9.0;
    	else
    		this.speed = 7.2;

	    if(this.level >= 6)
	    	this.bulletCd = 150;
	    else
	    	this.bulletCd = 250;

	    if(this.level >= 7)
	    	this.missileCd = 800;
	    else
	    {
		    if(this.level >= 6)
		    	this.missileCd = 1100;
		    else
		    	this.missileCd = 1500;
	    }

		this.sprite.body.velocity.x *= 0.985;
		this.sprite.body.velocity.y *= 0.985;

		if(game.math.distance(this.sprite.body.velocity.x, this.sprite.body.velocity.y, 0, 0) > 50)
		{	
			this.sprite.play('move' + this.level);
			this.thrusters++;
			if(this.thrusters > 100)
			{
				if(game.score.sound)
					thrust.play();
				this.thrusters = 0;
			}
		}
		else
			this.sprite.animations.frame = this.level*4;
	},

	fireMissiles: function(state)
	{
		if(game.time.now > this.missileNextFire && this.level >= 2)
		{
			if(game.score.sound)
				shoot.play();
			this.missileNextFire = game.time.now + this.missileCd;

			var point1 = new Phaser.Point(6*this.scale, -4*this.scale);
			var point2 = new Phaser.Point(-6*this.scale, -4*this.scale);

			var angle1 = Math.atan2(point1.y, point1.x);
			var angle2 = Math.atan2(point2.y, point2.x);

			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			var points = [];
			points.push(r1, r2);

			if(this.level >= 6)
			{
				point1 = new Phaser.Point(6*this.scale, -2*this.scale);
				point2 = new Phaser.Point(-6*this.scale, -2*this.scale);

				angle1 = Math.atan2(point1.y, point1.x);
				angle2 = Math.atan2(point2.y, point2.x);

				r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
				r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

				points.push(r1, r2);

				if(this.level >= 7)
				{
					point1 = new Phaser.Point(6*this.scale, -0*this.scale);
					point2 = new Phaser.Point(-6*this.scale, -0*this.scale);

					angle1 = Math.atan2(point1.y, point1.x);
					angle2 = Math.atan2(point2.y, point2.x);

					r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
					r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

					points.push(r1, r2);
					
				}
			}

			//game.add.existing(new Missile(game, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle, { x: 100.0, y: 100 }));
			//game.add.existing(new Missile(game, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle, { x: 100.0, y: 100 }));

			var t = null;
			var ts = [];
			var dist = 800;

			state.enemies.forEachAlive(function(m) {
		        var distance = game.math.distance(m.x, m.y, this.sprite.x, this.sprite.y);
		        if (distance < dist) {
		            t = m;
		            dist = distance;

		            ts.push(m);
		        }
		    }, this);

			if(t !== null)
			{
				var force = 0;

				for(var i = 0; i < points.length; i++)
				{			
					// target
					var tt = (i == 0) ? t : ts[game.rnd.integerInRange(0, ts.length-1)];
					this.launchMissile(state, this.sprite.x + points[i].x, this.sprite.y + points[i].y, tt);
					force += 20;
				}

				this.sprite.body.velocity.x -= Math.cos(this.sprite.angle * (Math.PI/180)) * force;
				this.sprite.body.velocity.y -= Math.sin(this.sprite.angle * (Math.PI/180)) * force;
			}
			else 
			{
				var force = 0;

				for(var i = 0; i < points.length; i++)
				{		
					var rangle = game.rnd.angle() * (Math.PI/180);	
					var distance = 250 + game.rnd.integerInRange(0, 200);

					t = { x: Math.cos(rangle) * distance + this.sprite.x + points[i].x, y: Math.sin(rangle) * distance + this.sprite.y + points[i].y };
					this.launchMissile(state, this.sprite.x + points[i].x, this.sprite.y + points[i].y, t);
					force += 20;
				}

				this.sprite.body.velocity.x -= Math.cos(this.sprite.angle * (Math.PI/180)) * force;
				this.sprite.body.velocity.y -= Math.sin(this.sprite.angle * (Math.PI/180)) * force;
			}

		}
	},
	fireBullets: function(state)
	{

		if(game.time.now > this.bulletNextFire)
		{
			if(game.score.sound)
				shoot.play();
			this.bulletNextFire = game.time.now + this.bulletCd;

			var force = 10 * 2;

			var point1 = new Phaser.Point(9*this.scale-4, -11*this.scale);
			var point2 = new Phaser.Point(-9*this.scale+4, -11*this.scale);

			var angle1 = Math.atan2(point1.y, point1.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);
			var angle2 = Math.atan2(point2.y, point2.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);

			var r1 = point1.rotate(0, 0, angle1 + this.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + this.sprite.angle * (Math.PI/180) + Math.PI/2);

			this.launchBullet(state, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle);
			this.launchBullet(state, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle);

			if(this.level >= 1)
			{
				force += 10 * 2;
				point1 = new Phaser.Point(3*this.scale, -12*this.scale);
				point2 = new Phaser.Point(-3*this.scale, -12*this.scale);

				angle1 = Math.atan2(point1.y, point1.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);
				angle2 = Math.atan2(point2.y, point2.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);

				r1 = point1.rotate(0, 0, angle1 + this.sprite.angle * (Math.PI/180) + Math.PI/2);
				r2 = point2.rotate(0, 0, angle2 + this.sprite.angle * (Math.PI/180) + Math.PI/2);

				this.launchBullet(state, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle);
				this.launchBullet(state, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle);
			}


			this.sprite.body.velocity.x -= Math.cos(this.sprite.angle * (Math.PI/180)) * force;
			this.sprite.body.velocity.y -= Math.sin(this.sprite.angle * (Math.PI/180)) * force;

			//game.add.existing(new Missile(game, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle, { x: 100.0, y: 100 }));
			//game.add.existing(new Missile(game, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle, { x: 100.0, y: 100 }));

		}
	},
	launchBullet: function(state, x, y, ang)
	{
		var bullet = state.bulletGroup.getFirstDead();

		if(bullet == null && state.bulletGroup.children.length > 50)
			return;

		var isNew = false;
		if(bullet === null)
		{
			bullet = new Bullet(game, x, y, ang, 0, state);
			state.bulletGroup.add(bullet);
			isNew = true;
		}

		bullet.revive();
		bullet.x = x;
		bullet.y = y;
		bullet.particels();
		bullet.life = 200;
		if(!isNew)
			bullet.type = 0;
		bullet.body.velocity.x += this.sprite.body.velocity.x*5;
		bullet.body.velocity.y += this.sprite.body.velocity.y*5;
		this.addCircle(state, x, y, 0.8);

		bullet.rotation = ang * (Math.PI / 180);
		bullet.angle = ang;

		return bullet;
	},
	launchMissile: function(state, x, y, target)
	{
		var missile = state.missileGroup.getFirstDead();

		if(missile == null && state.missileGroup.children.length > 30)
			return;

	    if (missile === null) 
	    {
	        missile = new Missile(game, x, y, this.sprite.angle, target, 0, state);
	        state.missileGroup.add(missile);
	    }

	    missile.revive();

	    missile.life = missile.maxLife;
    	missile.x = x;
    	missile.y = y;
    	missile.particels();
    	missile.type = 0;
    	this.addCircle(state, x, y, 0.6);

    	missile.rotation = this.sprite.angle * (Math.PI/180);
		missile.angle = this.sprite.angle;

		missile.target_object = target;

    	return missile;
    	
	},
	addCircle: function(state, x, y, s)
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
    	circle.alpha = 0.5;
    	circle.tick = 10;
    	circle.deltaScale = ((s-0.2)/circle.tick);

    	return circle;
	},
	damage: function(bullet) 
	{
		this.life -= bullet.damage();
		game.score.current_state.damageToPlayer();

		if(this.life <= 0)
		{
			this.sprite.kill();
			game.score.gameOver = true;
		}
	},
	damageToExplosion: function(ex) 
	{
		this.life -= ex.damage;
		ex.doDamage = false;
		game.score.current_state.damageToPlayer();

		if(this.life <= 0)
		{
			this.sprite.kill();
			game.score.gameOver = true;
		}
	},
	killAll: function()
	{
		this.sprite.kill();
		if(this.level >= 5)
			this.autogun.kill();
	}
}

Object.defineProperty(Player.prototype, 'x', {

    get: function() {
        return this.sprite.x;
    },

    set: function(value) {
        this.sprite.x = value;
    }

});

Object.defineProperty(Player.prototype, 'y', {

    get: function() {
        return this.sprite.y;
    },

    set: function(value) {
        this.sprite.y = value;
    }

});