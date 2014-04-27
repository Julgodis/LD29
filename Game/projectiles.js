/*
*
*  Julgodis 2014
*  projectiles.js
*
*/

var FireCircle = function(game, x, y, s)
{
	Phaser.Sprite.call(this, game, x, y, 'smoke');
	this.scale.setTo(s, s);
	this.anchor.setTo(0.5, 0.5);
	this.scale.smoothed = false;

	this.tick = 10;
	this.maxScale = s;
	this.deltaScale = ((s-0.2)/this.tick);
}

FireCircle.prototype = Object.create(Phaser.Sprite.prototype);
FireCircle.prototype.constructor = FireCircle;

FireCircle.prototype.update = function() 
{
	if (!this.alive) 
	{
        return;
    } 

    this.tick--;
    if(this.tick < 0)
    	this.kill();

    this.scale.setTo(this.tick*this.deltaScale + 0.2, this.tick*this.deltaScale + 0.2);
}

// --------------------------------

var Bullet = function(game, x, y, rot, type2, parent)
{
	Phaser.Sprite.call(this, game, x, y, (type2 == 0) ? 'bullet' : 'enemy_bullet');
    this.scale.setTo(1, 1);
	this.scale.smoothed = false;
	this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.outOfWorldKill, this);

    this.angle = rot;
    this.body.rotation = this.angle * (Math.PI/180);
    this.body.updateBounds();

    this.SPEED = ((type2 == 0) ? 650 : 500) + (game.rnd.integerInRange(1, 360)/360.0) * 100;
    this.body.setSize(16, 20, 0, 0);
    this.type = type2;
    this.oldType = type2;
    this.life = 300;

    this.water = parent;
    this.particels();
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.killAll = function()
{
	this.kill();
	if(this.smokeEmitter)
	{
		if (this.smokeEmitter.group)
		{
		   this.smokeEmitter.group.remove(this.smokeEmitter);
		}
		else if (this.smokeEmitter.parent)
		{
		   this.smokeEmitter.parent.removeChild(this.smokeEmitter);
		}

		this.smokeEmitter.removeAll();
		this.smokeEmitter = null;
	}
}

Bullet.prototype.particels = function()
{
    if(game.score.detail == 0 && (!this.smokeEmitter || this.smokeEmitter == null)) 
    {
	    this.smokeEmitter = this.game.add.emitter(0, 0, 30);
		this.smokeEmitter.filters = [ this.water.displacementFilter ];

	    this.smokeEmitter.gravity = 0;
	    this.smokeEmitter.setXSpeed(0, 0);
	    this.smokeEmitter.setYSpeed(0, 0); 

	    this.smokeEmitter.setAlpha(0.5, 0, 1000, Phaser.Easing.Linear.InOut);

	    this.smokeEmitter.makeParticles('smoke');
	   	this.smokeEmitter.minParticleScale = 0.3;
		this.smokeEmitter.maxParticleScale = 0.1;
		this.smokeEmitter.smoothed = false;

		this.smokeEmitter.width = 0;
		this.smokeEmitter.height = 0;
		this.smokeEmitter.emitX = 0;
		this.smokeEmitter.emitY = 0;

	    this.smokeEmitter.start(false, 1000, 25);
	    this.smokePosition = new Phaser.Point(this.width/2, 0);
	}
}

Bullet.prototype.update = function() 
{
    if (!this.alive) 
	{
        if(game.score.detail == 0 && this.smokeEmitter) this.smokeEmitter.on = false;
        if (this.parent)
		{
		   this.parent.removeChild(this);
		}
        return;
    } 
    else 
    {
        if(game.score.detail == 0 && this.smokeEmitter) this.smokeEmitter.on = true;
    }
    this.life--;

    if(this.life <= 0)
    {
    	this.kill();
    	return;
    }

	if(game.score.detail == 0 && this.smokeEmitter) 
	{	
		this.smokeEmitter.width = this.width;
		this.smokeEmitter.height = this.height;
		this.smokeEmitter.emitX = 0;
		this.smokeEmitter.emitY = 0;
		this.smokeEmitter.x = this.x;
		this.smokeEmitter.y = this.y;
	}

    if(this.type != this.oldType)
    {
    	this.oldType = this.type;
    	this.loadTexture((this.type == 0) ? 'bullet' : 'enemy_bullet');
    	this.SPEED = ((this.type == 0) ? 650 : 500) + (game.rnd.integerInRange(1, 360)/360.0) * 100;
    }

	this.body.updateBounds();

    this.body.velocity.x = Math.cos(this.angle * (Math.PI/180)) * this.SPEED;
    this.body.velocity.y = Math.sin(this.angle * (Math.PI/180)) * this.SPEED;

}

Bullet.prototype.damage = function() {
	return this.type == 0 ? 15 : (-0.5+1.5*this.game.score.gameLevel);
};

Bullet.prototype.outOfWorldKill = function(bullet) {
	bullet.killAll();
};

/*Object.defineProperty(Bullet.prototype, 'type', {

    get: function() {
        return this._type;
    },

    set: function(value) {
    	if(this._type != value)
    	{
        	this._type = value;
        	this.loadTexture((this._type == 0) ? 'bullet' : 'enemy_bullet');
		}
    }

});*/

// ----------------------------------------

var Missile = function(game, x, y, rot, _target, type2, parent)
{
    Phaser.Sprite.call(this, game, x, y, (type2 == 0) ? 'rocket' : 'enemy_rocket');

    this.scale.setTo(2, 2);
	this.scale.smoothed = false;

    this.target_object = _target;
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.outOfWorldKill, this);

    this.rotation = rot * (Math.PI/180);
    this.angle = rot;
    this.maxLife = 200;
    this.life = this.maxLife;

    this.SPEED = (type2 == 0) ? 400 : 540;
    this.TURN_RATE = 10;
    this.WOBBLE_LIMIT = 30; 
    this.WOBBLE_SPEED = 350; 
    this.SMOKE_LIFETIME = 1000; 

    this.wobble = this.WOBBLE_LIMIT;
    this.game.add.tween(this)
        .to(
            { wobble: -this.WOBBLE_LIMIT },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
        );

    this.water = parent;
    this.type = type2;
    this.oldType = type2;

    this.particels();
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.killAll = function()
{
	this.kill();
	if(this.smokeEmitter)
	{
		if (this.smokeEmitter.group)
		{
		   this.smokeEmitter.group.remove(this.smokeEmitter);
		}
		else if (this.smokeEmitter.parent)
		{
		   this.smokeEmitter.parent.removeChild(this.smokeEmitter);
		}

		this.smokeEmitter.removeAll();
		this.smokeEmitter = null;
	}
}


Missile.prototype.particels = function() {
	if(game.score.detail == 0 && (!this.smokeEmitter || this.smokeEmitter == null)) 
	{    
	    this.smokeEmitter = this.game.add.emitter(0, 0, 50);
	    this.smokeEmitter.filters = [ this.water.displacementFilter ];

	    this.smokeEmitter.gravity = 0;
	    this.smokeEmitter.setXSpeed(0, 0);
	    this.smokeEmitter.setYSpeed(0, 0); 

	    this.smokeEmitter.setAlpha(0.5, 0, this.SMOKE_LIFETIME,
	        Phaser.Easing.Linear.InOut);

	    this.smokeEmitter.makeParticles('smoke');
	   	this.smokeEmitter.minParticleScale = 0.3;
		this.smokeEmitter.maxParticleScale = 0.1;
		this.smokeEmitter.smoothed = false;

	    this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 40);
	    this.smokePosition = new Phaser.Point(this.width/2, 0);
	}
};

Missile.prototype.update = function() 
{
	if (!this.alive || this.life <= 0) 
	{
        if(game.score.detail == 0 && this.smokeEmitter) this.smokeEmitter.on = false;
        if (this.parent)
		{
		   this.parent.removeChild(this);
		}
        return;
    } 
    else 
    {
        if(game.score.detail == 0 && this.smokeEmitter) this.smokeEmitter.on = true;
    }

    if(this.type != this.oldType)
    {
    	this.SPEED = (this.type == 0) ? 400 : 560;
    	this.oldType = this.type;
    	this.loadTexture((this.type == 0) ? 'rocket' : 'enemy_rocket');
    }
    this.life--;

    if(game.score.detail == 0 && this.smokeEmitter) 
    {
		var rposition = this.smokePosition.rotate(0, 0, this.rotation);
		this.smokeEmitter.x = this.x - rposition.x;
		this.smokeEmitter.y = this.y - rposition.y;
	}

	if(this.target_object == null || !("x" in this.target_object) || !("y" in this.target_object))
	{
		this.life = 0;
		return;
	}

	var dx = this.x - this.target_object.x;
	var dy = this.y - this.target_object.y;
	var angle = Math.atan2(dy, dx) + Math.PI + game.rnd.angle() * (Math.PI/180) * 0.5;
	angle += this.game.math.degToRad(this.wobble); 

	var avoidAngle = 0;
    this.parent.forEachAlive(function(m) {
        if (this == m) return;
        if (avoidAngle !== 0) return;

        var distance = this.game.math.distance(this.x, this.y, m.x, m.y);
        if (distance < 30 && this.game.math.chanceRoll(50)) {
            avoidAngle = (Math.PI/2) * (game.rnd.angle()/180) + 40;

            if (this.game.math.chanceRoll(50)) avoidAngle *= -1;
        }
    }, this);
    angle += avoidAngle * (Math.PI/180);

	if(this.rotation !== angle)
	{
		var delta = angle - this.rotation;
		if(delta > Math.PI) delta -= Math.PI*2;
		if(delta < -Math.PI) delta += Math.PI*2;

		if(delta > 0) this.angle += this.TURN_RATE;
		else this.angle -= this.TURN_RATE;

		if(Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE))
			this.rotation = angle;
	}

    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;

};

Missile.prototype.outOfWorldKill = function(missile) {
	missile.killAll();
};

Missile.prototype.total_damage = function() {
	return this.type == 0 ? 5 : (2.0+0.1*this.game.score.gameLevel); 
};



