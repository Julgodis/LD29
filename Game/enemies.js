/*
*
*  Julgodis 2014
*  enemies.js
*
*/


var Enemy = function(game, x, y, t, target)
{
	Phaser.Sprite.call(this, game, x, y, 'enemy');
	this.scale.setTo(2, 2);
	this.anchor.setTo(0.5, 0.5);

	this.smoothed = false;
	this.target = target;

	game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.drag.set(0.1);
	this.body.maxVelocity.setTo(600, 600);
	this.body.collideWorldBounds = true;
	this.body.setSize(20, 16, 0, 0);

	this.speed = 0;
	this.type = t;
	this.life = 100;

	this.bulletCd = 400.0;
	this.bulletNextFire = 0;
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() 
{
	if (!this.alive) 
	{
        return;
    } 

    this.speed *= 0.98;
	var distance = game.math.distance(this.x, this.y, this.target.x, this.target.y);
    if(distance >= 200)
    {
    	this.speed = (distance/2 + 200);
    	if(this.speed > 300)
    		this.speed = 300;

    }

    var dx = this.x - (this.target.x + (this.target.sprite.body.velocity.x * 0.2));
	var dy = this.y - (this.target.y + (this.target.sprite.body.velocity.y * 0.2));
	var angle = Math.atan2(dy, dx);

	this.angle = angle * (180/Math.PI);

    this.body.velocity.x = Math.cos(this.angle * (Math.PI/180) + Math.PI) * this.speed;
    this.body.velocity.y = Math.sin(this.angle * (Math.PI/180) + Math.PI) * this.speed;
}

Enemy.prototype.damage = function(bullet) {
	this.life -= bullet.damage();

	if(this.life <= 0)
		this.kill();
};

Enemy.prototype.damageToExplosion = function(ex) {
	this.life -= ex.damage;
	ex.doDamage = false;

	if(this.life <= 0)
		this.kill();
};

