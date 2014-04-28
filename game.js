/*
*
*  Julgodis 2014
*  game.js
*
*/

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
game.score = {
	aniMenu: true,
	controls: false,
	gameLevel: 1,
	gameOver: false,
	kills: 0,
	upgrad: 0,
	detail: 0,
	sound: true,
	upgrads: 
	[
		'NONE',
		'More guns',
		'Missiles :D',
		'Faster guns',
		'Better engine',
		'Automatic mini gun',
		'More missiles!',
		'Even more missiles!'
	],
	killsToNextUpgrad: function(d)
	{
		var u = d || this.upgrad;
		if(u < 0)
			return 0;

		var n = (u+1)*(u+1) * 6.595 + 2;
		n -= this.kills;

		return n < 0 ? 0 : Math.floor(n);
	}
};

game.state.add('start', Start);
game.state.add('loading', Loader);
game.state.add('intro', Intro);

game.state.add('game', WaterEffect);
game.state.add('menu', Menu);
game.state.add('controls', Controls);
game.state.add('dead', Dead);

// Run game!
game.state.start('start');

function graphics_toggle(id)
{
	if(game.score.detail == 0)
	{
		game.score.detail = 1;
		document.getElementById(id).innerHTML = "Very Low graphics";
	}
	else if(game.score.detail == 1)
	{
		game.score.detail = 2;
		document.getElementById(id).innerHTML = "High graphics";
	}
	else
	{
		game.score.detail = 0;
		document.getElementById(id).innerHTML = "Low graphics";
	}
}

function sound_toggle(id)
{
	if(game.score.sound)
	{
		game.score.sound = false;
		if(game.score.music)
			game.score.music.stop();
		document.getElementById(id).innerHTML = "Sound on";
	}
	else
	{
		game.score.sound = true;
		if(game.score.music)
			game.score.music.play();
		document.getElementById(id).innerHTML = "Sound off";
	}
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-39491934-3', {
  'cookieDomain': 'none'
});
ga('send', 'pageview');
