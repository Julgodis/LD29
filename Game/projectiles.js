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


var Bullet = function(game, x, y, rot)
{
	Phaser.Sprite.call(this, game, x, y, 'rocket');
	this.scale.setTo(0.5, 0.5);
	this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.outOfWorldKill, this);

    this.angle = rot;
    this.body.rotation = this.angle * (Math.PI/180);
    this.body.updateBounds();

    this.SPEED = 450 + (game.rnd.integerInRange(1, 360)/360.0) * 50;
    this.body.setSize(16, 20, 0, 0);
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function() 
{
	if (!this.alive) 
	{
        return;
    } 

	this.body.updateBounds();

    this.body.velocity.x = Math.cos(this.angle * (Math.PI/180)) * this.SPEED;
    this.body.velocity.y = Math.sin(this.angle * (Math.PI/180)) * this.SPEED;

}

Bullet.prototype.damage = function() {
	return 5;
};

Bullet.prototype.outOfWorldKill = function(bullet) {
	bullet.kill();
};

var Missile = function(game, x, y, rot, _target)
{
    Phaser.Sprite.call(this, game, x, y, 'rocket');

    this.scale.setTo(0.5, 0.5);

    this.target_object = _target;
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.checkWorldBounds = true;
    this.events.onOutOfBounds.add(this.outOfWorldKill, this);

    this.rotation = rot * (Math.PI/180);
    this.angle = rot;

    this.SPEED = 250;
    this.TURN_RATE = 5;
    this.WOBBLE_LIMIT = 15; 
    this.WOBBLE_SPEED = 250; 
    this.SMOKE_LIFETIME = 1000; 

    this.wobble = this.WOBBLE_LIMIT;
    this.game.add.tween(this)
        .to(
            { wobble: -this.WOBBLE_LIMIT },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
        );

    this.smokeEmitter = this.game.add.emitter(0, 0, 100);

    this.smokeEmitter.gravity = 0;
    this.smokeEmitter.setXSpeed(0, 0);
    this.smokeEmitter.setYSpeed(0, 0); 

    this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME,
        Phaser.Easing.Linear.InOut);

    this.smokeEmitter.makeParticles('smoke');
   	this.smokeEmitter.minParticleScale = 0.5;
	this.smokeEmitter.maxParticleScale = 0.501;

    this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);
    this.smokePosition = new Phaser.Point(this.width/2, 0);
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;

Missile.prototype.update = function() 
{
	if (!this.alive) 
	{
        this.smokeEmitter.on = false;
        return;
    } 
    else 
    {
        this.smokeEmitter.on = true;
    }

	var rposition = this.smokePosition.rotate(0, 0, this.rotation);
	this.smokeEmitter.x = this.x - rposition.x;
	this.smokeEmitter.y = this.y - rposition.y;

	var dx = this.x - this.target_object.x;
	var dy = this.y - this.target_object.y;
	var angle = Math.atan2(dy, dx) + Math.PI;
	angle += this.game.math.degToRad(this.wobble); 

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
	missile.kill();
};

Missile.prototype.damage = function() {
	return 20;
};



