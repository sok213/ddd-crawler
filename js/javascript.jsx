var DungeonGame = React.createClass({
	getInitialState: function() {
		return {
			hero: {
				speed: 120, // movement in pixels per second
				x: 0,
				y: 0,
				weapon: 'None',
				health: 150,
				maxDMG: 1,
				level: 1,
				dead: false
			},
			monster: {
				health: 100,
				maxDMG: 1,
				level: 1,
				dead: false,
				x: 0,
				y: 0
			},
			monster2: {
				health: 100,
				maxDMG: 1,
				level: 1,
				dead: false,
				x: 0,
				y: 0
			},
			monster3: {
				health: 100,
				maxDMG: 2,
				level: 2,
				dead: false,
				x: 0,
				y: 0
			},
			monster4: {
				health: 100,
				maxDMG: 2,
				level: 2,
				dead: false,
				x: 0,
				y: 0
			},
			monster5: {
				health: 100,
				maxDMG: 3,
				level: 3,
				dead: false,
				x: 0,
				y: 0
			},
			monster6: {
				health: 100,
				maxDMG: 3,
				level: 3,
				dead: false,
				x: 0,
				y: 0
			},
			weapon: {
				x: 40,
				y: 600,
				status: false
			},
			healthPack: {
				x: 0,
				y: 0,
				status: false
			},
			healthPack2: {
				x: 0,
				y: 0,
				status: false
			},
			healthPack3: {
				x: 0,
				y: 0,
				status: false
			},
			healthPack4: {
				x: 0,
				y: 0,
				status: false
			},
			healthPack5: {
				x: 0,
				y: 0,
				status: false
			}
		}
	},

	initializeGame: function() {
		console.log("initializeGame function started.");

		// Context variables
		var canvas = document.getElementById('gameCanvas'),
		ctx = canvas.getContext('2d'),
		self = this.state;

		// Sound asset variables
		var healthSound = document.createElement('AUDIO'),
		levelUpSound = document.createElement('AUDIO'),
		weaponEquipSound = document.createElement('AUDIO'),
		deathSound = document.createElement('AUDIO'),
		attackSound = document.createElement('AUDIO'),
		killSound = document.createElement('AUDIO');

		// Game Mechanics Variables
		var collision = false,
		left = false,
		right = false,
		down = false,
		up = false,
		playerY,
		playerX,
		leveledUp = false;

		healthSound.src = "assets/sounds/health.mp3";
		levelUpSound.src = "assets/sounds/levelup.mp3";
		weaponEquipSound.src = "assets/sounds/weapon.mp3";
		deathSound.src = "assets/sounds/death.mp3";
		attackSound.src = "assets/sounds/attack.mp3";
		killSound.src = "assets/sounds/kill.mp3";

		// Disables anti-aliasing for sharp sprites.
		ctx.imageSmoothingEnabled = false;

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
		monsterImage.src = "assets/images/demonLevel1.png";

		// Monster image 2
		var monsterReady2 = false;
		var monsterImage2 = new Image();
		monsterImage2.onload = function () {
			monsterReady2 = true;
		};
		monsterImage2.src = "assets/images/demonLevel2.png";

		// Monster image 3
		var monsterReady3 = false;
		var monsterImage3 = new Image();
		monsterImage3.onload = function () {
			monsterReady3 = true;
		};
		monsterImage3.src = "assets/images/demon2.png";

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
			self.monster.x = 32 + (Math.random() * (canvas.width - 64));
			self.monster.y = 32 + (Math.random() * (canvas.height - 64));

			self.monster2.x = 32 + (Math.random() * (canvas.width - 64));
			self.monster2.y = 32 + (Math.random() * (canvas.height - 64));

			self.monster3.x = 32 + (Math.random() * (canvas.width - 64));
			self.monster3.y = 32 + (Math.random() * (canvas.height - 64));

			self.monster4.x = 32 + (Math.random() * (canvas.width - 64));
			self.monster4.y = 32 + (Math.random() * (canvas.height - 64));

			self.monster5.x = 32 + (Math.random() * (canvas.width - 64));
			self.monster5.y = 32 + (Math.random() * (canvas.height - 64));

			self.monster6.x = 32 + (Math.random() * (canvas.width - 64));
			self.monster6.y = 32 + (Math.random() * (canvas.height - 64));

			// Throw healthPack items somewhere on the screen randomly.
			self.healthPack.x = 32 + (Math.random() * (canvas.width - 64));
			self.healthPack.y = 32 + (Math.random() * (canvas.height - 64));

			self.healthPack2.x = 32 + (Math.random() * (canvas.width - 64));
			self.healthPack2.y = 32 + (Math.random() * (canvas.height - 64));

			self.healthPack3.x = 32 + (Math.random() * (canvas.width - 64));
			self.healthPack3.y = 32 + (Math.random() * (canvas.height - 64));

			self.healthPack4.x = 32 + (Math.random() * (canvas.width - 64));
			self.healthPack4.y = 32 + (Math.random() * (canvas.height - 64));

			self.healthPack5.x = 32 + (Math.random() * (canvas.width - 64));
			self.healthPack5.y = 32 + (Math.random() * (canvas.height - 64));
		};

		// Player movement and wall collsion rules.
		var playerMovement = function(modifier) {

			/* KEY PRESS & COLLISION RULES
			*--------------------------------------------
			*/
		
			// Player holding up
			if(38 in keysDown) { 
				self.hero.y -= self.hero.speed * modifier; 
			}
			// Player holding down
			if(40 in keysDown) {
				self.hero.y += self.hero.speed * modifier;
			}
			// Player holding left
			if(37 in keysDown) {
				self.hero.x -= self.hero.speed * modifier;
			}
			// Player holding right
			if(39 in keysDown) {
				self.hero.x += self.hero.speed * modifier;
			}

			/* WALL COLLISION RULES
			*--------------------------------------------
			*/

			// Player reaches left wall
			if(self.hero.x <= -7) {
				self.hero.x = -7;
			}
			// Player reaches right wall
			if(self.hero.x >= 1168) {
				self.hero.x = 1168;
			}
			// Player reaches top wall
			if(self.hero.y <= -0.37) {
				self.hero.y = -0.37;
			}
			// Player reaches bottom wall
			if(self.hero.y >= 663.73) {
				self.hero.y = 663.73;
			}

			/* PLAYER ANIMATIONS
			*--------------------------------------------
			*/

			// Player holding up
			if(38 in keysDown) { 
				heroImage.src = "assets/images/blocky/blocky_examine.png" 
			}
			// Player holding down
			if(40 in keysDown) {
				heroImage.src = "assets/images/blocky/blocky.png"
			}
			// Player holding left
			if(37 in keysDown) {
				heroImage.src = "assets/images/blocky/blocky_left.png"
			}
			// Player holding right
			if(39 in keysDown) {
				heroImage.src = "assets/images/blocky/blocky_right.png"
			}

			// Detect if player is touching a monster.
			if(
				self.hero.x <= (self.monster.x + 32)
				&& self.monster.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster.y + 32)
				&& self.monster.y <= (self.hero.y + 32)
			) {
				attackSound.play();
				console.log("Player has encountered a demon.")
				if(!playerX) {
					playerX = self.hero.x;
					playerY = self.hero.y;
				}

				self.hero.x = playerX;
				self.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.monster.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.hero.maxDMG * self.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.monster.maxDMG * self.monster.level)) + 5);

					self.monster.health -= playerAttack;
					self.hero.health -= monsterAttack;

					console.log('Monster HP: ' + self.monster.health)
					console.log('Player HP: ' + self.hero.health)
				}
			} else if(
				self.hero.x <= (self.monster6.x + 32)
				&& self.monster6.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster6.y + 32)
				&& self.monster6.y <= (self.hero.y + 32)
			) {
				attackSound.play();
				console.log("Player has encountered a demon.")
				if(!playerX) {
					playerX = self.hero.x;
					playerY = self.hero.y;
				}

				self.hero.x = playerX;
				self.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.monster6.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.hero.maxDMG * self.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.monster6.maxDMG * self.monster6.level)) + 5);

					self.monster6.health -= playerAttack;
					self.hero.health -= monsterAttack;

					console.log('Monster HP: ' + self.monster6.health)
					console.log('Player HP: ' + self.hero.health)
				}
			} else if(
				self.hero.x <= (self.monster2.x + 32)
				&& self.monster2.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster2.y + 32)
				&& self.monster2.y <= (self.hero.y + 32)
			) {
				attackSound.play();
				console.log("Player has encountered a demon.")
				if(!playerX) {
					playerX = self.hero.x;
					playerY = self.hero.y;
				}

				self.hero.x = playerX;
				self.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.monster2.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.hero.maxDMG * self.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.monster2.maxDMG * self.monster2.level)) + 5);

					self.monster2.health -= playerAttack;
					self.hero.health -= monsterAttack;

					console.log('Monster HP: ' + self.monster2.health)
					console.log('Player HP: ' + self.hero.health)
				}
			} else if(
				self.hero.x <= (self.monster3.x + 32)
				&& self.monster3.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster3.y + 32)
				&& self.monster3.y <= (self.hero.y + 32)
			) {
				attackSound.play();
				console.log("Player has encountered a demon.")
				if(!playerX) {
					playerX = self.hero.x;
					playerY = self.hero.y;
				}

				self.hero.x = playerX;
				self.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.monster3.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.hero.maxDMG * self.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.monster3.maxDMG * self.monster3.level)) + 5);

					self.monster3.health -= playerAttack;
					self.hero.health -= monsterAttack;

					console.log('Monster HP: ' + self.monster3.health)
					console.log('Player HP: ' + self.hero.health)
				}
			} else if(
				self.hero.x <= (self.monster4.x + 32)
				&& self.monster4.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster4.y + 32)
				&& self.monster4.y <= (self.hero.y + 32)
			) {
				attackSound.play();
				console.log("Player has encountered a demon.")
				if(!playerX) {
					playerX = self.hero.x;
					playerY = self.hero.y;
				}

				self.hero.x = playerX;
				self.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.monster4.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.hero.maxDMG * self.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.monster4.maxDMG * self.monster4.level)) + 5);

					self.monster4.health -= playerAttack;
					self.hero.health -= monsterAttack;

					console.log('Monster HP: ' + self.monster4.health)
					console.log('Player HP: ' + self.hero.health)
				}
			} else if(
				self.hero.x <= (self.monster5.x + 32)
				&& self.monster5.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster5.y + 32)
				&& self.monster5.y <= (self.hero.y + 32)
			) {
				attackSound.play();
				console.log("Player has encountered a demon.")
				if(!playerX) {
					playerX = self.hero.x;
					playerY = self.hero.y;
				}

				self.hero.x = playerX;
				self.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.monster5.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.hero.maxDMG * self.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.monster.maxDMG * self.monster5.level)) + 5);

					self.monster5.health -= playerAttack;
					self.hero.health -= monsterAttack;

					console.log('Monster HP: ' + self.monster5.health)
					console.log('Player HP: ' + self.hero.health)
				}
			} else {
				playerX = undefined;
				playerY = undefined;
			}

			// Level up player if all enemies are dead
			if(
				self.monster.health <= 0 && self.monster2.health <= 0
				&& self.monster3.health <= 0 && self.monster4.health <= 0
				&& self.monster5.health <= 0 && self.monster6.health <= 0
			) {
				if(leveledUp === false) {
					self.hero.level = 2;
					levelUpSound.play();
					leveledUp = true;
				}
			}

			// When player runs out of health.
			if(self.hero.health <= 0) {
				if(self.hero.dead === false) {
					console.log('Player has died.');
					deathSound.play();
					self.hero.health = 0;
					self.hero.dead = true;
				} 
				self.hero.health = 0;
			}

			// Detect if player touched Health Pack.
			if(self.hero.x <= (self.healthPack.x + 32)
				&& self.healthPack.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.healthPack.y + 32)
				&& self.healthPack.y <= (self.hero.y + 32)
				&& self.healthPack.status === false
			) {
				if(self.hero.health < 150) {
					healthSound.play();
					self.healthPack.status = true;
					self.hero.health += 50;

					if(self.hero.health > 150) {
						self.hero.health = 150;
					}
					console.log('Player has picked up Health Pack. Player health: '+self.hero.health);
				} else {
					console.log('Player health is full.')
				}
			}

			if(self.hero.x <= (self.healthPack2.x + 32)
				&& self.healthPack2.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.healthPack2.y + 32)
				&& self.healthPack2.y <= (self.hero.y + 32)
				&& self.healthPack2.status === false
			) {
				if(self.hero.health < 150) {
					healthSound.play();
					self.healthPack2.status = true;
					self.hero.health += 50;

					if(self.hero.health > 150) {
						self.hero.health = 150;
					}
					console.log('Player has picked up Health Pack. Player health: '+self.hero.health);
				} else {
					console.log('Player health is full.')
				}
			}

			if(self.hero.x <= (self.healthPack3.x + 32)
				&& self.healthPack3.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.healthPack3.y + 32)
				&& self.healthPack3.y <= (self.hero.y + 32)
				&& self.healthPack3.status === false
			) {
				if(self.hero.health < 150) {
					healthSound.play();
					self.healthPack3.status = true;
					self.hero.health += 50;

					if(self.hero.health > 150) {
						self.hero.health = 150;
					}
					console.log('Player has picked up Health Pack. Player health: '+self.hero.health);
				} else {
					console.log('Player health is full.')
				}
			}

			if(self.hero.x <= (self.healthPack4.x + 32)
				&& self.healthPack4.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.healthPack4.y + 32)
				&& self.healthPack4.y <= (self.hero.y + 32)
				&& self.healthPack4.status === false
			) {
				if(self.hero.health < 150) {
					healthSound.play();
					self.healthPack4.status = true;
					self.hero.health += 50;

					if(self.hero.health > 150) {
						self.hero.health = 150;
					}
					console.log('Player has picked up Health Pack. Player health: '+self.hero.health);
				} else {
					console.log('Player health is full.')
				}
			}

			if(self.hero.x <= (self.healthPack5.x + 32)
				&& self.healthPack5.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.healthPack5.y + 32)
				&& self.healthPack5.y <= (self.hero.y + 32)
				&& self.healthPack5.status === false
			) {
				if(self.hero.health < 150) {
					healthSound.play();
					self.healthPack5.status = true;
					self.hero.health += 50;

					if(self.hero.health > 150) {
						self.hero.health = 150;
					}
					console.log('Player has picked up Health Pack. Player health: '+self.hero.health);
				} else {
					console.log('Player health is full.')
				}
			}

			// Detect if player picked up weapon.
			if(self.hero.x <= (self.weapon.x + 32)
				&& self.weapon.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.weapon.y + 32)
				&& self.weapon.y <= (self.hero.y + 32)
				&& self.weapon.status === false
			) {
				weaponEquipSound.play();
				self.hero.weapon = 'Iron Hammer';
				self.hero.maxDMG = 20;
				self.weapon.status = true;
				console.log('Player has picked up Iron Hammer!');
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
		var render = function() {
			// Draw background image
			if(bgReady) {
				ctx.drawImage(bgImage, 0, 0);
			}

			// Draw health packs
			if(healthReady && self.healthPack.status === false) {
				ctx.drawImage(healthImage, self.healthPack.x, self.healthPack.y, 25, 25);
			}

			if(healthReady && self.healthPack2.status === false) {
				ctx.drawImage(healthImage, self.healthPack2.x, self.healthPack2.y, 25, 25);
			}

			if(healthReady && self.healthPack3.status === false) {
				ctx.drawImage(healthImage, self.healthPack3.x, self.healthPack3.y, 25, 25);
			}

			if(healthReady && self.healthPack4.status === false) {
				ctx.drawImage(healthImage, self.healthPack4.x, self.healthPack4.y, 25, 25);
			}

			if(healthReady && self.healthPack5.status === false) {
				ctx.drawImage(healthImage, self.healthPack5.x, self.healthPack5.y, 25, 25);
			}

			// Draw hero
			if(heroReady) {
				ctx.drawImage(heroImage, self.hero.x, self.hero.y, heroImage.width * 2.2, heroImage.height * 2.2);
			}

			// Draw monsters
			if(monsterReady && self.monster.health > 0) {
				ctx.drawImage(monsterImage, self.monster.x, self.monster.y, monsterImage.width / 8, monsterImage.height / 8);
			}
			
			if(monsterReady2 && self.monster2.health > 0) {
				ctx.drawImage(monsterImage, self.monster2.x, self.monster2.y, monsterImage.width / 8, monsterImage.height / 8);
			}

			if(monsterReady2 && self.monster3.health > 0) {
				ctx.drawImage(monsterImage2, self.monster3.x, self.monster3.y, monsterImage2.width / 8, monsterImage2.height / 8);
			}

			if(monsterReady3 && self.monster4.health > 0) {
				ctx.drawImage(monsterImage2, self.monster4.x, self.monster4.y, monsterImage2.width / 8, monsterImage2.height / 8);
			}

			if(monsterReady3 && self.monster5.health > 0) {
				ctx.drawImage(monsterImage3, self.monster5.x, self.monster5.y, monsterImage3.width / 8, monsterImage3.height / 8);
			}

			if(monsterReady && self.monster6.health > 0) {
				ctx.drawImage(monsterImage3, self.monster6.x, self.monster6.y, monsterImage3.width / 8, monsterImage3.height / 8);
			}
			
			// Draw weapon
			if(weaponReady && self.weapon.status === false) {
				ctx.drawImage(weaponImage, self.weapon.x, self.weapon.y, weaponImage.width * 2, weaponImage.height * 2);
			}

			if(self.monster.health <= 0) {
				self.monster.y = null;
				self.monster.x = null;
				if(self.monster.dead === false) {
					killSound.play();
					self.monster.dead = true;
				}
			}

			if(self.monster2.health <= 0) {
				self.monster2.y = null;
				self.monster2.x = null;
				if(self.monster2.dead === false) {
					killSound.play();
					self.monster2.dead = true;
				}
			}

			if(self.monster3.health <= 0) {
				self.monster3.y = null;
				self.monster3.x = null;
				if(self.monster3.dead === false) {
					killSound.play();
					self.monster3.dead = true;
				}
			}

			if(self.monster4.health <= 0) {
				self.monster4.y = null;
				self.monster4.x = null;
				if(self.monster4.dead === false) {
					killSound.play();
					self.monster4.dead = true;
				}
			}

			if(self.monster5.health <= 0) {
				self.monster5.y = null;
				self.monster5.x = null;
				if(self.monster5.dead === false) {
					killSound.play();
					self.monster5.dead = true;
				}
			}

			if(self.monster6.health <= 0) {
				self.monster6.y = null;
				self.monster6.x = null;
				if(self.monster6.dead === false) {
					killSound.play();
					self.monster6.dead = true;
				}
			}

			// Display player stats.
			ctx.fillStyle = "rgb(0, 255, 0)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("HP: "+self.hero.health+'/150', 20, 10);

			ctx.fillStyle = "rgb(255, 255, 0)";
			ctx.fillText("Level: "+self.hero.level, 180, 10);
			ctx.fillStyle = "rgb(26, 198, 255)";
			ctx.fillText("Weapon: "+self.hero.weapon, 290, 10);

		}

		var gameOver = function() {

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
		<canvas id='gameCanvas' height='700' width='1200'></canvas>
    </div>
	}
});

// Render the canvas to the DOM.
var dungeonGame = ReactDOM.render(<DungeonGame />, document.getElementById('body'));
// Initializes the game.
dungeonGame.initializeGame();