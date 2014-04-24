var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', 
	{ 
		preload: preload, 
		create: create,
		update: update,
		render: render
	});

function preload() 
{
    game.load.image('einstein', 'assets/test.jpg');
	game.time.events.loop(Phaser.Timer.SECOND, function() {}, this);
}

var sprite;

function create() 
{
    sprite = game.add.sprite(300, 300, 'einstein');
    sprite.scale.setTo(0.2, 0.2);
    
}

function update()
{
	var time = (Math.PI*2)*game.time.events.duration.toFixed(0) / 1000.0;
	sprite.scale.setTo(0.2*Math.cos(time) + 0.2, 0.2*Math.sin(time) + 0.2);
	sprite.angle = time*(180/Math.PI);
}

function render() 
{

	var time = (Math.PI*2)*game.time.events.duration.toFixed(0) / 1000.0;
    game.debug.text("Time until event: " + time, 32, 32);
    game.debug.text("Next tick: " + game.time.events.nextTick.toFixed(0), 32, 64);

}


