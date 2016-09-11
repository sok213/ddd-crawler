var DungeonGame = React.createClass({
	getInitialState: function() {
		return {
			hero: {
				level: 1,
				health: 100,
				weapon: "None"
			},
			monster: {
				health: 100,
				x: 0,
				y: 0
			},
			weapon: {
				x:0,
				y:0
			}
		}
	},

	initializeGame: function() {
		console.log("initializeGame function started.");
		var canvas = document.getElementById('gameCanvas');
		var ctx = canvas.getContext('2d');
		var healthSound = document.createElement('AUDIO');
		healthSound.src = "assets/sounds/health.mp3";


		// Disables anti-aliasing for sharp sprites.
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false; /// future

		document.body.appendChild(canvas);

		// Background image
		var bgReady = false;
		var bgImage = new Image();
		bgImage.onload = function() {
			bgReady = true;
		};
		bgImage.src = "assets/images/background.png";

		// Hero image
		var heroReady = false;
		var heroImage = new Image();
		heroImage.onload = function () {
			heroReady = true;
		};
		heroImage.src = "assets/images/blocky/blocky.png";

		// Weapon image 
		var weaponReady = false;
		var weaponImage = new Image();
		weaponImage.onload = function () {
			weaponReady = true;
		};
		weaponImage.src = "assets/images/hammer.png";



		// Health pack image
		var healthReady = false;
		var healthImage = new Image();
		healthImage.onload = function() {
			healthReady = true;
		}
		healthImage.src = "assets/images/health.png";

		// Monster image
		var monsterReady = false;
		var monsterImage = new Image();
		monsterImage.onload = function () {
			monsterReady = true;
		};
		monsterImage.src = "assets/images/demon2.png";

		// Game Objects
		var hero = {
			speed: 256, // movement in pixels per second
			x: 0,
			y: 0,
			weapon: 'None',
			health: 100,
			maxDMG: 15,
			level: 1
		};

		// Monster won't move so it will only have coordinates.
		var monster = {
			health: 100,
			x: 0,
			y: 0
		};

		// Health items
		var health = {
			x:0,
			y:0,
			status: false
		}

		// weapn item
		var weapon = {
			x:0,
			y:0
		}

		// Stores the number of monsters the player has caught.
		var monstersCaught = 0;

		// Handle keyboard controls.
		var keysDown = {};

		// We are storing the user input for later instead of 
		// acting upon it immediately in order to retain tight control
		// over when and if things happen.
		addEventListener('keydown', function(e) {
			// Stores any event's keyCode. If a keyCode is in the object, 
			// that means the user is currenlty pressing that key.
			keysDown[e.keyCode] = true;
		}, false);

		// When the user releases the key, delete the keysDown object.
		addEventListener('keyup', function(e) {
			delete keysDown[e.keyCode];
		}, false);


		var generateMonster = function() {
			// Throw the monster somewhere on the screen randomly
			monster.x = 32 + (Math.random() * (canvas.width - 64));
			monster.y = 32 + (Math.random() * (canvas.height - 64));

			// Throw health items somewhere on the screen randomly.
			health.x = 32 + (Math.random() * (canvas.width - 64));
			health.y = 32 + (Math.random() * (canvas.height - 64));
		};

		// Player movement and wall collsion rules.
		var playerMovement = function(modifier) {
			if(hero.y < 3 && hero.x < -5) {
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
			} else if(hero.y < 660 && hero.x < -5) {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
			} else if(hero.y > 660 && hero.x > 1170) {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding left
				if(37 in keysDown) {
					hero.x -= hero.speed * modifier;
				}
			} else if(hero.y > 660 && hero.x < -5) {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
			} else if(hero.y < 3 && hero.x > 1170) {
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
				// Player holding left
				if(37 in keysDown) {
					hero.x -= hero.speed * modifier;
				}
			} else if(hero.y < 3){
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
				// Player holding left
				if(37 in keysDown) {
					hero.x -= hero.speed * modifier;
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
			} else if(hero.y > 660) {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding left
				if(37 in keysDown) {
					hero.x -= hero.speed * modifier;
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
			} else if(hero.x < -5) {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
			} else if(hero.x > 1170) {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
				// Player holding left
				if(37 in keysDown) {
					hero.x -= hero.speed * modifier;
				}
			} else {
				// Player holding up
				if(38 in keysDown) { 
					hero.y -= hero.speed * modifier; 
				}
				// Player holding down
				if(40 in keysDown) {
					hero.y += hero.speed * modifier;
				}
				// Player holding left
				if(37 in keysDown) {
					hero.x -= hero.speed * modifier;
				}
				// Player holding right
				if(39 in keysDown) {
					hero.x += hero.speed * modifier;
				}
			}

			// Are they touching?
			if(
				hero.x <= (monster.x + 32)
				&& monster.x <= (hero.x + 32)
				&& hero.y <= (monster.y + 32)
				&& monster.y <= (hero.y + 32)
			) {
				hero.health -= 15;
				console.log("Player has encountered a demon.")
			}

			// When player runs out of health.
			if(hero.health <= 0) {
				console.log('Player has died.');
				hero.health = 0;
			}

			// Detect if player touched Health Pack.
			if(hero.x <= (health.x + 32)
				&& health.x <= (hero.x + 32)
				&& hero.y <= (health.y + 32)
				&& health.y <= (hero.y + 32)
				&& health.status === false
			) {
				if(hero.health < 100) {
					healthSound.play();
					health.status = true;
					hero.health += 25;

					if(hero.health > 100) {
						hero.health = 100;
					}
					console.log('Player has picked up Health Pack. Player health: '+hero.health);
				} else {
					console.log('Player health is full.')
				}
			}
		};

		/*
		What is modifier?

			modifier is a time-based number based on 1.
			If exactly one second has passed, the value will be 1 and the
			hero's speed will be multiplied by 1, meaning he will have moved
			256 pixels in that second. If one half of a second had passed, the value will be
			0.5 and the hero will haved moved half of his speed in that amount of time.
			And so forth.
		*/

		// Draw everything
		var self = this.state;
		var render = function() {
			if(bgReady) {
				ctx.drawImage(bgImage, 0, 0);
			}

			if(heroReady) {
				ctx.drawImage(heroImage, hero.x, hero.y, heroImage.width * 2.2, heroImage.height * 2.2);
			}

			if(monsterReady) {
				ctx.drawImage(monsterImage, monster.x, monster.y, monsterImage.width / 8, monsterImage.height / 8);
			}

			if(healthReady && health.status === false) {
				ctx.drawImage(healthImage, health.x, health.y, 25, 25);
				//ctx.drawImage(healthImage, health2.x, health2.y, 25, 25);
			}

			if(weaponReady) {
			//	ctx.drawImage(weaponImage, 20, 550, 40, 40);
			}

			// Display player stats.
			ctx.fillStyle = "rgb(0, 255, 0)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("HP: "+self.hero.health+'/100', 20, 10);

			ctx.fillStyle = "rgb(255, 255, 0)";
			ctx.fillText("Level: "+self.hero.level, 180, 10);
			ctx.fillStyle = "rgb(26, 198, 255)";
			ctx.fillText("Weapon: "+self.hero.weapon, 290, 10);

		}

		// The main game loop
		var main = function() {
			var now = Date.now();
			var delta = now - then;

			playerMovement(delta / 1000);
			render();

			then = now;

			// Request to do this again ASAP
			requestAnimationFrame(main);
		}

		// Let's play this game!
		var then = Date.now();
		generateMonster();
		main();
	},

	render: function() {
	    return <div>
    	<div className="logo"><img src="logo.png"></img></div>
		<canvas id='gameCanvas' height='700' width='1200' ></canvas>
    </div>;
	}
});

// Render the canvas to the DOM.
var dungeonGame = ReactDOM.render(<DungeonGame />, document.getElementById('body'));
// Initializes the game.
dungeonGame.initializeGame();