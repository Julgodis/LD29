/*
*
*  Julgodis 2014
*  player.js
*
*/

var Player = function(game) { };

Player.prototype = 
{
	speed: 8.0,
	missileCd: 500.0,
	missileNextFire: 0,

	bulletCd: 200.0,
	bulletNextFire: 0,

	scale: 2,
	level: 3, 

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
		this.sprite.body.velocity.x *= 0.98;
		this.sprite.body.velocity.y *= 0.98;

		//console.log("X: " + this.sprite.x + ", Y: " + this.sprite.y);
	},

	fireMissiles: function(state)
	{
		if(game.time.now > this.missileNextFire)
		{
			this.missileNextFire = game.time.now + this.missileCd;

			var point1 = new Phaser.Point(6*this.scale-2, -6*this.scale);
			var point2 = new Phaser.Point(-6*this.scale+2, -6*this.scale);

			var angle1 = Math.atan2(point1.y, point1.x);
			var angle2 = Math.atan2(point2.y, point2.x);

			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			//game.add.existing(new Missile(game, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle, { x: 100.0, y: 100 }));
			//game.add.existing(new Missile(game, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle, { x: 100.0, y: 100 }));

			var t = null;
			var dist = 500;
			state.enemies.forEachAlive(function(m) {
		        var distance = game.math.distance(m.x, m.y, this.sprite.x, this.sprite.y);
		        if (distance < dist) {
		            t = m;
		            dist = distance;
		        }
		    }, this);

			if(t !== null)
			{
				this.lunchMissile(state, this.sprite.x + r1.x, this.sprite.y + r1.y, t);
				this.lunchMissile(state, this.sprite.x + r2.x, this.sprite.y + r2.y, t);
			}

		}
	},
	fireBullets: function(state)
	{

		if(game.time.now > this.bulletNextFire)
		{
			this.bulletNextFire = game.time.now + this.bulletCd;

			var point1 = new Phaser.Point(9*this.scale-4, -11*this.scale);
			var point2 = new Phaser.Point(-9*this.scale+4, -11*this.scale);

			var angle1 = Math.atan2(point1.y, point1.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);
			var angle2 = Math.atan2(point2.y, point2.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);

			var r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
			var r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

			this.lunchBullet(state, this.sprite.x + r1.x, this.sprite.y + r1.y);
			this.lunchBullet(state, this.sprite.x + r2.x, this.sprite.y + r2.y);

			if(this.level > 2)
			{
				point1 = new Phaser.Point(3*this.scale, -12*this.scale);
				point2 = new Phaser.Point(-3*this.scale, -12*this.scale);

				angle1 = Math.atan2(point1.y, point1.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);
				angle2 = Math.atan2(point2.y, point2.x) + (game.rnd.integerInRange(1, 360)/360.0) * (Math.PI/12);

				r1 = point1.rotate(0, 0, angle1 + player.sprite.angle * (Math.PI/180) + Math.PI/2);
				r2 = point2.rotate(0, 0, angle2 + player.sprite.angle * (Math.PI/180) + Math.PI/2);

				this.lunchBullet(state, this.sprite.x + r1.x, this.sprite.y + r1.y);
				this.lunchBullet(state, this.sprite.x + r2.x, this.sprite.y + r2.y);
			}

			//game.add.existing(new Missile(game, this.sprite.x + r1.x, this.sprite.y + r1.y, this.sprite.angle, { x: 100.0, y: 100 }));
			//game.add.existing(new Missile(game, this.sprite.x + r2.x, this.sprite.y + r2.y, this.sprite.angle, { x: 100.0, y: 100 }));

		}
	},
	lunchBullet: function(state, x, y)
	{
		var bullet = state.bulletGroup.getFirstDead();

		if(bullet === null)
		{
			bullet = new Bullet(game, x, y, this.sprite.angle);
			state.bulletGroup.add(bullet);
		}

		bullet.revive();
		bullet.x = x;
		bullet.y = y;
		this.addCircle(state, x, y, 1);

		bullet.rotation = this.sprite.angle * (Math.PI / 180);
		bullet.angle = this.sprite.angle;

		return bullet;
	},
	lunchMissile: function(state, x, y, target)
	{
		var missile = state.missileGroup.getFirstDead();

	    if (missile === null) 
	    {
	        missile = new Missile(game, x, y, this.sprite.angle, target);
	        state.missileGroup.add(missile);
	    }

	    missile.revive();

    	missile.x = x;
    	missile.y = y;
    	this.addCircle(state, x, y, 1);

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
    	circle.tick = 10;
    	circle.deltaScale = ((s-0.2)/circle.tick);

    	return circle;
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