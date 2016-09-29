var DungeonGame = React.createClass({
	getInitialState: function() {
		return {
			gameOver: false,
			hero: {
				speed: 120, // movement in pixels per second
				x: 48,
				y: 652,
				weapon: 'None',
				health: 150,
				maxHealth: 150,
				maxDMG: 1,
				level: 1,
				skull: false,
				dead: false
			},
			skull: {
				taken: false,
				x: null,
				y: null
			},
			monster: {
				health: 100,
				maxDMG: 1,
				level: 1,
				dead: false,
				x: null,
				y: null
			},
			monster2: {
				health: 100,
				maxDMG: 1,
				level: 1,
				dead: false,
				x: null,
				y: null
			},
			monster3: {
				health: 100,
				maxDMG: 2,
				level: 2,
				dead: false,
				x: null,
				y: null
			},
			monster4: {
				health: 100,
				maxDMG: 2,
				level: 2,
				dead: false,
				x: null,
				y: null
			},
			monster5: {
				health: 100,
				maxDMG: 3,
				level: 3,
				dead: false,
				x: null,
				y: null
			},
			monster6: {
				health: 100,
				maxDMG: 3,
				level: 3,
				dead: false,
				x: null,
				y: null
			},
			weapon: {
				x: 1114,
				y: 611,
				status: false
			},
			healthPack: {
				x: null,
				y: null,
				status: false
			},
			healthPack2: {
				x: null,
				y: null,
				status: false
			},
			healthPack3: {
				x: null,
				y: null,
				status: false
			},
			healthPack4: {
				x: null,
				y: null,
				status: false
			},
			healthPack5: {
				x: null,
				y: null,
				status: false
			}
		}
	},

	initializeGame: function() {

		// Context variables
		var canvas = document.getElementById('gameCanvas'),
		ctx = canvas.getContext('2d'),
		self = this.state,
		self2 = this,
		noLevelNoSkull = false,
		noLevel = false,
		noSkull = false,
		doorPass = false,
		healthFull = false,
		saveState = this.getInitialState();

		// Sound asset variables
		var healthSound = new Audio("assets/sounds/health.mp3"),
		levelUpSound = new Audio("assets/sounds/levelup.mp3"),
		weaponEquipSound = new Audio("assets/sounds/weapon.mp3"),
		deathSound = new Audio("assets/sounds/death.mp3"),
		attackSound = new Audio("assets/sounds/attack.mp3"),
		killSound = new Audio("assets/sounds/kill.mp3"),
		sic = new Audio("assets/sounds/sic.mp3");
		sic.play();

		// Keep looping the music.
		sic.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);

		// Game Mechanics Variables
		var collision = false,
		left = false,
		right = false,
		down = false,
		up = false,
		playerY,
		playerX,
		leveledUp = false;

		// Disables anti-aliasing for sharp sprites.
		ctx.imageSmoothingEnabled = false;

		document.body.appendChild(canvas);

		// Background image
		var bgReady = false;
		var bgImage = new Image();
		bgImage.onload = function() {
			bgReady = true;
		};
		bgImage.src = "assets/images/background2.png";

		// Bottom bar image
		var bgReady2 = false;
		var bgImage2 = new Image();
		bgImage2.onload = function() {
			bgReady2 = true;
		};
		bgImage2.src = "assets/images/wood.jpg";

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

		// Door image 
		var doorReady = false;
		var doorImage = new Image();
		doorImage.onload = function () {
			doorReady = true;
		};
		doorImage.src = "assets/images/door.png";

		// Skull image
		var skullReady = false;
		var skullImage = new Image();
		skullImage.onload = function () {
			skullReady = true;
		};
		skullImage.src = "assets/images/goldskull.png";

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


		var generateObjects = function() {
			var coordinates = [];

			//	Functions that specify ranges for each section on the canvas. 
			function genSec1() {
				var randomXSec1 = (Math.random() * 290),
				randomYSec1 = (Math.random() * 250);
				return [randomXSec1, randomYSec1, false];
			}

			function genSec2() {
				var randomXSec2 = (Math.random() * (522 - 170)) + 170,
				randomYSec2 = (Math.random() * (664 - 403)) + 403;
				return [randomXSec2, randomYSec2, false];
			}

			function genSec3() {
				var randomXSec3 = (Math.random() * (630 - 363)) + 363,
				randomYSec3 = (Math.random() * (341 - 45)) + 45;
				return [randomXSec3, randomYSec3, false];
			}

			function genSec4() {
				var randomXSec4 = (Math.random() * (1060 - 600)) + 600,
				randomYSec4 = (Math.random() * (663 - 532)) + 532;
				return [randomXSec4, randomYSec4, false];
			}

			function genSec5() {
				var randomXSec5 = (Math.random() * (884 - 716)) + 716,
				randomYSec5 = (Math.random() * 452);
				return [randomXSec5, randomYSec5, false];
			}

			for(var x = 2; x > 0 ; x--) {
				coordinates.push(genSec1());
				coordinates.push(genSec2());
				coordinates.push(genSec4());
				coordinates.push(genSec5());
			}

			for(var x = 3; x > 0 ; x--) {
				coordinates.push(genSec3());
			}

			function getCoords(object) {
				var i = Math.floor(Math.random() * (coordinates.length - 1));
				var unusedCoord = [];

				// change array object to true to know that is has been used.
				coordinates[i][2] = true;

				coordinates.filter(function(arr) {
					if(arr[2] === false) {
						unusedCoord.push(arr);
					}
				});

				object.x = coordinates[i][0];
				object.y = coordinates[i][1];

				coordinates = unusedCoord;
			}

			// Throw the monsters somewhere on the screen randomly
			getCoords(self.monster);
			getCoords(self.monster2);
			getCoords(self.monster3);
			getCoords(self.monster4);
			getCoords(self.monster5);
			getCoords(self.monster6);

			// Throw healthPack items somewhere on the screen randomly.
			getCoords(self.healthPack);
			getCoords(self.healthPack2);
			getCoords(self.healthPack3);
			getCoords(self.healthPack4);
			getCoords(self.healthPack5);
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

			// WALL #1 COLLISIONS
			if(self.hero.y >= 280 && self.hero.x >= 118 && self.hero.x <= 130) {
				self.hero.x = 118;
			} else if(self.hero.y >= 276 && self.hero.x >= 119 && self.hero.x <= 165 && self.hero.y <= 295) {
				self.hero.y = 276; 
			} else if(self.hero.y >= 276 && self.hero.x <= 165 && self.hero.x >= 120) {
				self.hero.x = 165;
			}

			// WALL #2 COLLISIONS
			if(self.hero.x >= 305 && self.hero.x <= 320 && self.hero.y <= 360) {
				self.hero.x = 305;
			} else if(self.hero.y <= 365 && self.hero.x <= 340 && self.hero.x >= 305) {
				self.hero.y = 365;
			} else if(self.hero.x <= 354 && self.hero.x >= 305 && self.hero.y <= 365) {
				self.hero.x = 354;
			}

			// WALL #3 COLLISIONS
			if(self.hero.x >= 540 && self.hero.x <= 550 && self.hero.y >= 478) {
				self.hero.x = 540;
			} else if(self.hero.y >= 470 && self.hero.y <= 480 && self.hero.x <= 588 && self.hero.x >= 550) {
				self.hero.y = 470;
			} else if(self.hero.x <= 590 && self.hero.x >= 580 && self.hero.y >= 480) {
				self.hero.x = 590;
			}


			// WALL #4 COLLISIONS 
			if(self.hero.x >= 656 && self.hero.x <= 670 && self.hero.y <= 257) {
				self.hero.x = 656;
			} else if(self.hero.x >= 660 && self.hero.x <= 689 && self.hero.y <= 257) {
				self.hero.y = 257;
			} else if(self.hero.x <= 705 && self.hero.x >= 690 && self.hero.y <= 250) {
				self.hero.x = 705;
			}

			// WALL #5 COLLISIONS
			if(self.hero.y <= 512 && self.hero.y >= 500 && self.hero.x >= 780) {
				self.hero.y = 512;
			} else if(self.hero.y >= 470 && self.hero.y <= 500 && self.hero.x >= 773) {
				self.hero.x = 773;
			} else if(self.hero.y >= 460 && self.hero.y <= 469 && self.hero.x >= 780) {
				self.hero.y = 460;
			}

			// WALL #6 COLLISIONS
			if(self.hero.y <= 184 && self.hero.x >= 908 && self.hero.x <= 920) {
				self.hero.x = 908;
			} else if(self.hero.y <= 186 && self.hero.x >= 908 && self.hero.x <= 1132 && self.hero.y >= 175) {
				self.hero.y = 186;
			} else if(self.hero.y <= 180 && self.hero.y >= 140 && self.hero.x <= 1129 && self.hero.x >= 1119) {
				self.hero.x = 1129;
			} else if(self.hero.x <= 957 && self.hero.x >= 948 && self.hero.y <= 140) {
				self.hero.x = 957;
			} else if(self.hero.y >= 135 && self.hero.y <= 145 && self.hero.x <= 1129 && self.hero.x >= 950) {
				self.hero.y = 135;
			}

			if(self.hero.y >= 135 && self.hero.y <= 140 && self.hero.x >= 950 && self.hero.x <= 957) {
				self.hero.y = 135;
				self.hero.x = 957;
			}

			/* PLAYER ANIMATIONS
			*--------------------------------------------
			*/

			// Player holding up
			if(38 in keysDown) { 
				if(self.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blocky_examineHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky_examine.png";
				} 
			}
			// Player holding down
			if(40 in keysDown) {
				if(self.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blockyHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky.png";
				}
			}
			// Player holding left
			if(37 in keysDown) {
				if(self.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blocky_leftHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky_left.png";
				}
			}
			// Player holding right
			if(39 in keysDown) {
				if(self.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blocky_rightHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky_right.png";
				}
			}

			// Detect if player is touching a monster.
			if(
				self.hero.x <= (self.monster.x + 32)
				&& self.monster.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster.y + 32)
				&& self.monster.y <= (self.hero.y + 32)
			) {
				attackSound.play();
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
				}
			} else if(
				self.hero.x <= (self.monster6.x + 32)
				&& self.monster6.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster6.y + 32)
				&& self.monster6.y <= (self.hero.y + 32)
			) {
				attackSound.play();
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
				}
			} else if(
				self.hero.x <= (self.monster2.x + 32)
				&& self.monster2.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster2.y + 32)
				&& self.monster2.y <= (self.hero.y + 32)
			) {
				attackSound.play();
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
				}
			} else if(
				self.hero.x <= (self.monster3.x + 32)
				&& self.monster3.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster3.y + 32)
				&& self.monster3.y <= (self.hero.y + 32)
			) {
				attackSound.play();
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
				}
			} else if(
				self.hero.x <= (self.monster4.x + 32)
				&& self.monster4.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster4.y + 32)
				&& self.monster4.y <= (self.hero.y + 32)
			) {
				attackSound.play();
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
				}
			} else if(
				self.hero.x <= (self.monster5.x + 32)
				&& self.monster5.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.monster5.y + 32)
				&& self.monster5.y <= (self.hero.y + 32)
			) {
				attackSound.play();
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
				} else {
					healthFull = true;
				}
			} else if(self.hero.x <= (self.healthPack2.x + 32)
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
				} else {
					healthFull = true;
				}
			} else if(self.hero.x <= (self.healthPack3.x + 32)
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
				} else {
					healthFull = true;
				}
			} else if(self.hero.x <= (self.healthPack4.x + 32)
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
				} else {
					healthFull = true;
				}
			} else if(self.hero.x <= (self.healthPack5.x + 32)
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
				} else {
					healthFull = true;
				}
			} else {
				healthFull = false;
			}

			// Detect if player picked up weapon.
			if(self.hero.x <= (self.weapon.x + 32)
				&& self.weapon.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.weapon.y + 32)
				&& self.weapon.y <= (self.hero.y + 32)
				&& self.weapon.status === false
			) {
				weaponEquipSound.play();
				self.hero.weapon = 'Hammer';
				self.hero.maxDMG = 20;
				self.weapon.status = true;
			}

			// Detect if player picked up Golden Skill.
			if(self.hero.x <= (self.skull.x + 32)
				&& self.skull.x <= (self.hero.x + 32)
				&& self.hero.y <= (self.skull.y + 32)
				&& self.skull.y <= (self.hero.y + 32)
			) {
				self.skull.x = null;
				self.skull.y = null;
				weaponEquipSound.play();
				self.hero.skull = true;
			}

			// Detect if player is touching door.
			if(self.hero.x <= ((canvas.width / 2.4) + 32)
				&& canvas.width / 2.4 <= (self.hero.x + 32)
				&& self.hero.y <= (0 + 32)
				&& 0 <= (self.hero.y + 32)
			) {
				if(self.hero.skull === false && self.hero.level < 2) {
					noLevelNoSkull = true;
				} else if(self.hero.skull == true && self.hero.level < 2) {
					noLevel = true;
				} else if(self.hero.skull === false && self.hero.level == 2) {
					noSkull = true;
				} else if(self.hero.skull == true & self.hero.level == 2) {
					doorPass = true;
				}
			} else {
				noLevelNoSkull = false;
				noLevel = false;
				noSkull = false;
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
			// Draw background image for stats display
			if(bgReady2) {
				ctx.drawImage(bgImage2, 0, 0);
			}

			// Draw background image
			if(bgReady) {
				ctx.drawImage(bgImage, 0, 0);
			}

			// Draw door
			if(doorReady) {
				ctx.drawImage(doorImage, canvas.width / 2.4, 0, doorImage.width * 2, doorImage.height * 2);
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

			// Draw Golden Skull
			if(skullReady && self.hero.skull === false) {
				self.skull.x = 1058;
				self.skull.y = 60;
				ctx.drawImage(skullImage, 1058, 60, skullImage.width * 1.3, skullImage.height * 1.3);
			} else {
				self.skull.x = null;
				self.skull.y = null;
			}


			// Monster death detection for all six monsters.
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

			// If health is full while touching a health pack.
			if(healthFull == true) {
				ctx.fillStyle = "rgb(255, 26, 26)";
				ctx.font = "20px Helvetica";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillText("Message: Health is full! Unable to pick up a health pack.", 500, 714);
			}

			// Player level up HP boost
			if(self.hero.level == 2) {
				self.hero.health = 200;
				self.hero.maxHealth = 200;
			}

			if(noLevelNoSkull == true) {
				ctx.fillStyle = "rgb(255, 26, 26)";
				ctx.font = "20px Helvetica";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillText("Message: Door is locked! Requires Level 2 and Golden Skull to unlock!", 500, 714);
			}

			if(noLevel == true) {
				ctx.fillStyle = "rgb(255, 26, 26)";
				ctx.font = "20px Helvetica";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillText("Message: Door is locked! Requires Level 2 to unlock!", 520, 714);
			}

			if(noSkull == true) {
				ctx.fillStyle = "rgb(255, 26, 26)";
				ctx.font = "20px Helvetica";
				ctx.textAlign = "left";
				ctx.textBaseline = "top";
				ctx.fillText("Message: Door is locked! Requires Golden Skull to unlock!", 570, 714);
			}

			// Display player stats.
			ctx.fillStyle = "rgb(0, 255, 0)";
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = "top";
			ctx.fillText("HP: "+self.hero.health+'/'+self.hero.maxHealth, 20, 710);

			ctx.fillStyle = "rgb(255, 255, 0)";
			ctx.fillText("Level: "+self.hero.level, 170, 710);
			ctx.fillStyle = "rgb(26, 198, 255)";
			ctx.fillText("Weapon: "+self.hero.weapon, 270, 710);
		}

		// The main game loop
		var main = function() {
			if(self.hero.health <= 0) {
				sic.pause();

				// Clear the canvas
		        ctx.fillStyle = "#000000";
		        ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.fillStyle = "rgb(255, 0, 0)";
				ctx.font = "50px Helvetica";
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText("Game Over.", canvas.width / 2, canvas.height / 3);

				ctx.font = "20px Helvetica";
				ctx.fillStyle = "rgb(250, 100, 0)";
				ctx.fillText("(Press enter to try again)", canvas.width / 2, canvas.height / 2.4);

				addEventListener("keydown", function(e) {
					if(e.keyCode == 13) {

						// Restart the game.
						self2.setState(saveState);
						dungeonGame.initializeGame();
						main();
					}
				});
			} else {
				var now = Date.now();
				var delta = now - then;
				playerMovement(delta / 1000);
				render();
				then = now;
				// Request to do this again ASAP
				requestAnimationFrame(main);
			}
		}

		// Start the game.
		var then = Date.now();
		generateObjects();
		main();
	},

	render: function() {
	    return <div>
    	<div className="logo"><img src="logo.png"></img></div>
		<canvas id='gameCanvas' height='750' width='1200'></canvas>
		<h4>Tip: Press spacebar to toggle visibility. &nbsp;&nbsp;<a href="https://github.com/sok213/ddd-crawler/blob/master/js/javascript.jsx" target="_blank">View source code.</a></h4>
    </div>
	}
});

// Render the canvas to the DOM.
var dungeonGame = ReactDOM.render(<DungeonGame />, document.getElementById('body'));

// Initializes the game.
dungeonGame.initializeGame();