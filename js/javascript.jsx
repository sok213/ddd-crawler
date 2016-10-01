var then = Date.now();
// Sound asset variables
var healthSound = new Audio("assets/sounds/health.mp3"),
levelUpSound = new Audio("assets/sounds/levelup.mp3"),
weaponEquipSound = new Audio("assets/sounds/weapon.mp3"),
deathSound = new Audio("assets/sounds/death.mp3"),
attackSound = new Audio("assets/sounds/attack.mp3"),
killSound = new Audio("assets/sounds/kill.mp3"),
sic = new Audio("assets/sounds/sic.mp3"),
winSound = new Audio("assets/sounds/win.mp3");

var DungeonGame = React.createClass({
	getInitialState: function() {
		return {
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
		// restart the game music.
		sic.currentTime = 0;
		// Context variables
		var canvas = document.getElementById('gameCanvas'),
		ctx = canvas.getContext('2d'),
		self = this,
		noLevelNoSkull = false,
		noLevel = false,
		noSkull = false,
		doorPass = false,
		healthFull = false;

		// Start the game music.
		sic.play();

		// Keep looping the music.
		sic.addEventListener('ended', function() {
		    this.currentTime = 0;
		    this.play();
		}, false);

		// Keep looping the music.
		winSound.addEventListener('ended', function() {
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
			getCoords(self.state.monster);
			getCoords(self.state.monster2);
			getCoords(self.state.monster3);
			getCoords(self.state.monster4);
			getCoords(self.state.monster5);
			getCoords(self.state.monster6);

			// Throw healthPack items somewhere on the screen randomly.
			getCoords(self.state.healthPack);
			getCoords(self.state.healthPack2);
			getCoords(self.state.healthPack3);
			getCoords(self.state.healthPack4);
			getCoords(self.state.healthPack5);
		};

		// Player movement and wall collsion rules.
		var playerMovement = function(modifier) {

			/* KEY PRESS & COLLISION RULES
			*--------------------------------------------
			*/
		
			// Player holding up
			if(38 in keysDown) { 
				self.state.hero.y -= self.state.hero.speed * modifier; 
			}
			// Player holding down
			if(40 in keysDown) {
				self.state.hero.y += self.state.hero.speed * modifier;
			}
			// Player holding left
			if(37 in keysDown) {
				self.state.hero.x -= self.state.hero.speed * modifier;
			}
			// Player holding right
			if(39 in keysDown) {
				self.state.hero.x += self.state.hero.speed * modifier;
			}

			/* WALL COLLISION RULES
			*--------------------------------------------
			*/

			// Player reaches left wall
			if(self.state.hero.x <= -7) {
				self.state.hero.x = -7;
			}
			// Player reaches right wall
			if(self.state.hero.x >= 1168) {
				self.state.hero.x = 1168;
			}
			// Player reaches top wall
			if(self.state.hero.y <= -0.37) {
				self.state.hero.y = -0.37;
			}
			// Player reaches bottom wall
			if(self.state.hero.y >= 663.73) {
				self.state.hero.y = 663.73;
			}

			// WALL #1 COLLISIONS
			if(self.state.hero.y >= 280 && self.state.hero.x >= 118 && self.state.hero.x <= 130) {
				self.state.hero.x = 118;
			} else if(self.state.hero.y >= 276 && self.state.hero.x >= 119 && self.state.hero.x <= 165 && self.state.hero.y <= 295) {
				self.state.hero.y = 276; 
			} else if(self.state.hero.y >= 276 && self.state.hero.x <= 165 && self.state.hero.x >= 120) {
				self.state.hero.x = 165;
			}

			// WALL #2 COLLISIONS
			if(self.state.hero.x >= 305 && self.state.hero.x <= 320 && self.state.hero.y <= 360) {
				self.state.hero.x = 305;
			} else if(self.state.hero.y <= 365 && self.state.hero.x <= 340 && self.state.hero.x >= 305) {
				self.state.hero.y = 365;
			} else if(self.state.hero.x <= 354 && self.state.hero.x >= 305 && self.state.hero.y <= 365) {
				self.state.hero.x = 354;
			}

			// WALL #3 COLLISIONS
			if(self.state.hero.x >= 540 && self.state.hero.x <= 550 && self.state.hero.y >= 478) {
				self.state.hero.x = 540;
			} else if(self.state.hero.y >= 470 && self.state.hero.y <= 480 && self.state.hero.x <= 588 && self.state.hero.x >= 550) {
				self.state.hero.y = 470;
			} else if(self.state.hero.x <= 590 && self.state.hero.x >= 580 && self.state.hero.y >= 480) {
				self.state.hero.x = 590;
			}


			// WALL #4 COLLISIONS 
			if(self.state.hero.x >= 656 && self.state.hero.x <= 670 && self.state.hero.y <= 257) {
				self.state.hero.x = 656;
			} else if(self.state.hero.x >= 660 && self.state.hero.x <= 689 && self.state.hero.y <= 257) {
				self.state.hero.y = 257;
			} else if(self.state.hero.x <= 705 && self.state.hero.x >= 690 && self.state.hero.y <= 250) {
				self.state.hero.x = 705;
			}

			// WALL #5 COLLISIONS
			if(self.state.hero.y <= 512 && self.state.hero.y >= 500 && self.state.hero.x >= 780) {
				self.state.hero.y = 512;
			} else if(self.state.hero.y >= 470 && self.state.hero.y <= 500 && self.state.hero.x >= 773) {
				self.state.hero.x = 773;
			} else if(self.state.hero.y >= 460 && self.state.hero.y <= 469 && self.state.hero.x >= 780) {
				self.state.hero.y = 460;
			}

			// WALL #6 COLLISIONS
			if(self.state.hero.y <= 184 && self.state.hero.x >= 908 && self.state.hero.x <= 920) {
				self.state.hero.x = 908;
			} else if(self.state.hero.y <= 186 && self.state.hero.x >= 908 && self.state.hero.x <= 1132 && self.state.hero.y >= 175) {
				self.state.hero.y = 186;
			} else if(self.state.hero.y <= 180 && self.state.hero.y >= 140 && self.state.hero.x <= 1129 && self.state.hero.x >= 1119) {
				self.state.hero.x = 1129;
			} else if(self.state.hero.x <= 957 && self.state.hero.x >= 948 && self.state.hero.y <= 140) {
				self.state.hero.x = 957;
			} else if(self.state.hero.y >= 135 && self.state.hero.y <= 145 && self.state.hero.x <= 1129 && self.state.hero.x >= 950) {
				self.state.hero.y = 135;
			}

			if(self.state.hero.y >= 135 && self.state.hero.y <= 140 && self.state.hero.x >= 950 && self.state.hero.x <= 957) {
				self.state.hero.y = 135;
				self.state.hero.x = 957;
			}

			/* PLAYER ANIMATIONS
			*--------------------------------------------
			*/

			// Player holding up
			if(38 in keysDown) { 
				if(self.state.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blocky_examineHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky_examine.png";
				} 
			}
			// Player holding down
			if(40 in keysDown) {
				if(self.state.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blockyHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky.png";
				}
			}
			// Player holding left
			if(37 in keysDown) {
				if(self.state.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blocky_leftHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky_left.png";
				}
			}
			// Player holding right
			if(39 in keysDown) {
				if(self.state.hero.weapon == "Hammer") {
					heroImage.src = "assets/images/blocky/blocky_rightHam.png";
				} else {
					heroImage.src = "assets/images/blocky/blocky_right.png";
				}
			}

			// Detect if player is touching a monster.
			if(
				self.state.hero.x <= (self.state.monster.x + 32)
				&& self.state.monster.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.monster.y + 32)
				&& self.state.monster.y <= (self.state.hero.y + 32)
			) {
				attackSound.play();
				if(!playerX) {
					playerX = self.state.hero.x;
					playerY = self.state.hero.y;
				}

				self.state.hero.x = playerX;
				self.state.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.state.monster.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.state.hero.maxDMG * self.state.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.state.monster.maxDMG * self.state.monster.level)) + 5);

					self.state.monster.health -= playerAttack;
					self.state.hero.health -= monsterAttack;
				}
			} else if(
				self.state.hero.x <= (self.state.monster6.x + 32)
				&& self.state.monster6.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.monster6.y + 32)
				&& self.state.monster6.y <= (self.state.hero.y + 32)
			) {
				attackSound.play();
				if(!playerX) {
					playerX = self.state.hero.x;
					playerY = self.state.hero.y;
				}

				self.state.hero.x = playerX;
				self.state.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.state.monster6.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.state.hero.maxDMG * self.state.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.state.monster6.maxDMG * self.state.monster6.level)) + 5);

					self.state.monster6.health -= playerAttack;
					self.state.hero.health -= monsterAttack;
				}
			} else if(
				self.state.hero.x <= (self.state.monster2.x + 32)
				&& self.state.monster2.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.monster2.y + 32)
				&& self.state.monster2.y <= (self.state.hero.y + 32)
			) {
				attackSound.play();
				if(!playerX) {
					playerX = self.state.hero.x;
					playerY = self.state.hero.y;
				}

				self.state.hero.x = playerX;
				self.state.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.state.monster2.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.state.hero.maxDMG * self.state.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.state.monster2.maxDMG * self.state.monster2.level)) + 5);

					self.state.monster2.health -= playerAttack;
					self.state.hero.health -= monsterAttack;
				}
			} else if(
				self.state.hero.x <= (self.state.monster3.x + 32)
				&& self.state.monster3.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.monster3.y + 32)
				&& self.state.monster3.y <= (self.state.hero.y + 32)
			) {
				attackSound.play();
				if(!playerX) {
					playerX = self.state.hero.x;
					playerY = self.state.hero.y;
				}

				self.state.hero.x = playerX;
				self.state.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.state.monster3.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.state.hero.maxDMG * self.state.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.state.monster3.maxDMG * self.state.monster3.level)) + 5);

					self.state.monster3.health -= playerAttack;
					self.state.hero.health -= monsterAttack;
				}
			} else if(
				self.state.hero.x <= (self.state.monster4.x + 32)
				&& self.state.monster4.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.monster4.y + 32)
				&& self.state.monster4.y <= (self.state.hero.y + 32)
			) {
				attackSound.play();
				if(!playerX) {
					playerX = self.state.hero.x;
					playerY = self.state.hero.y;
				}

				self.state.hero.x = playerX;
				self.state.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.state.monster4.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.state.hero.maxDMG * self.state.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.state.monster4.maxDMG * self.state.monster4.level)) + 5);

					self.state.monster4.health -= playerAttack;
					self.state.hero.health -= monsterAttack;
				}
			} else if(
				self.state.hero.x <= (self.state.monster5.x + 32)
				&& self.state.monster5.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.monster5.y + 32)
				&& self.state.monster5.y <= (self.state.hero.y + 32)
			) {
				attackSound.play();
				if(!playerX) {
					playerX = self.state.hero.x;
					playerY = self.state.hero.y;
				}

				self.state.hero.x = playerX;
				self.state.hero.y = playerY;

				// Combat Algorithm.
				if(
					self.state.monster5.health > 0 && (39 in keysDown || 37 in keysDown
					|| 40 in keysDown || 38 in keysDown)
				) {
					var playerAttack = Math.floor((Math.random() * (self.state.hero.maxDMG * self.state.hero.level)) + 5);
					var monsterAttack = Math.floor((Math.random() * (self.state.monster.maxDMG * self.state.monster5.level)) + 5);

					self.state.monster5.health -= playerAttack;
					self.state.hero.health -= monsterAttack;
				}
			} else {
				playerX = undefined;
				playerY = undefined;
			}

			// Level up player if all enemies are dead
			if(
				self.state.monster.health <= 0 && self.state.monster2.health <= 0
				&& self.state.monster3.health <= 0 && self.state.monster4.health <= 0
				&& self.state.monster5.health <= 0 && self.state.monster6.health <= 0
			) {
				if(leveledUp === false) {
					self.state.hero.level = 2;
					levelUpSound.play();
					leveledUp = true;
				}
			}

			// When player runs out of health.
			if(self.state.hero.health <= 0) {
				if(self.state.hero.dead === false) {
					deathSound.play();
					self.state.hero.health = 0;
					self.state.hero.dead = true;
				} 
				self.state.hero.health = 0;
			}

			// Detect if player touched Health Pack.
			if(self.state.hero.x <= (self.state.healthPack.x + 32)
				&& self.state.healthPack.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.healthPack.y + 32)
				&& self.state.healthPack.y <= (self.state.hero.y + 32)
				&& self.state.healthPack.status === false
			) {
				if(self.state.hero.health < 150) {
					healthSound.play();
					self.state.healthPack.status = true;
					self.state.hero.health += 50;

					if(self.state.hero.health > 150) {
						self.state.hero.health = 150;
					}
				} else {
					healthFull = true;
				}
			} else if(self.state.hero.x <= (self.state.healthPack2.x + 32)
				&& self.state.healthPack2.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.healthPack2.y + 32)
				&& self.state.healthPack2.y <= (self.state.hero.y + 32)
				&& self.state.healthPack2.status === false
			) {
				if(self.state.hero.health < 150) {
					healthSound.play();
					self.state.healthPack2.status = true;
					self.state.hero.health += 50;

					if(self.state.hero.health > 150) {
						self.state.hero.health = 150;
					}
				} else {
					healthFull = true;
				}
			} else if(self.state.hero.x <= (self.state.healthPack3.x + 32)
				&& self.state.healthPack3.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.healthPack3.y + 32)
				&& self.state.healthPack3.y <= (self.state.hero.y + 32)
				&& self.state.healthPack3.status === false
			) {
				if(self.state.hero.health < 150) {
					healthSound.play();
					self.state.healthPack3.status = true;
					self.state.hero.health += 50;

					if(self.state.hero.health > 150) {
						self.state.hero.health = 150;
					}
				} else {
					healthFull = true;
				}
			} else if(self.state.hero.x <= (self.state.healthPack4.x + 32)
				&& self.state.healthPack4.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.healthPack4.y + 32)
				&& self.state.healthPack4.y <= (self.state.hero.y + 32)
				&& self.state.healthPack4.status === false
			) {
				if(self.state.hero.health < 150) {
					healthSound.play();
					self.state.healthPack4.status = true;
					self.state.hero.health += 50;

					if(self.state.hero.health > 150) {
						self.state.hero.health = 150;
					}
				} else {
					healthFull = true;
				}
			} else if(self.state.hero.x <= (self.state.healthPack5.x + 32)
				&& self.state.healthPack5.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.healthPack5.y + 32)
				&& self.state.healthPack5.y <= (self.state.hero.y + 32)
				&& self.state.healthPack5.status === false
			) {
				if(self.state.hero.health < 150) {
					healthSound.play();
					self.state.healthPack5.status = true;
					self.state.hero.health += 50;

					if(self.state.hero.health > 150) {
						self.state.hero.health = 150;
					}
				} else {
					healthFull = true;
				}
			} else {
				healthFull = false;
			}

			// Detect if player picked up weapon.
			if(self.state.hero.x <= (self.state.weapon.x + 32)
				&& self.state.weapon.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.weapon.y + 32)
				&& self.state.weapon.y <= (self.state.hero.y + 32)
				&& self.state.weapon.status === false
			) {
				weaponEquipSound.play();
				self.state.hero.weapon = 'Hammer';
				self.state.hero.maxDMG = 20;
				self.state.weapon.status = true;
			}

			// Detect if player picked up Golden Skill.
			if(self.state.hero.x <= (self.state.skull.x + 32)
				&& self.state.skull.x <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (self.state.skull.y + 32)
				&& self.state.skull.y <= (self.state.hero.y + 32)
			) {
				self.state.skull.x = null;
				self.state.skull.y = null;
				weaponEquipSound.play();
				self.state.hero.skull = true;
			}

			// Detect if player is touching door.
			if(self.state.hero.x <= ((canvas.width / 2.4) + 32)
				&& canvas.width / 2.4 <= (self.state.hero.x + 32)
				&& self.state.hero.y <= (0 + 32)
				&& 0 <= (self.state.hero.y + 32)
			) {
				if(self.state.hero.skull === false && self.state.hero.level < 2) {
					noLevelNoSkull = true;
				} else if(self.state.hero.skull == true && self.state.hero.level < 2) {
					noLevel = true;
				} else if(self.state.hero.skull === false && self.state.hero.level == 2) {
					noSkull = true;
				} else if(self.state.hero.skull == true & self.state.hero.level == 2) {
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
			if(healthReady && self.state.healthPack.status === false) {
				ctx.drawImage(healthImage, self.state.healthPack.x, self.state.healthPack.y, 25, 25);
			}

			if(healthReady && self.state.healthPack2.status === false) {
				ctx.drawImage(healthImage, self.state.healthPack2.x, self.state.healthPack2.y, 25, 25);
			}

			if(healthReady && self.state.healthPack3.status === false) {
				ctx.drawImage(healthImage, self.state.healthPack3.x, self.state.healthPack3.y, 25, 25);
			}

			if(healthReady && self.state.healthPack4.status === false) {
				ctx.drawImage(healthImage, self.state.healthPack4.x, self.state.healthPack4.y, 25, 25);
			}

			if(healthReady && self.state.healthPack5.status === false) {
				ctx.drawImage(healthImage, self.state.healthPack5.x, self.state.healthPack5.y, 25, 25);
			}

			// Draw hero
			if(heroReady) {
				ctx.drawImage(heroImage, self.state.hero.x, self.state.hero.y, heroImage.width * 2.2, heroImage.height * 2.2);
			}

			// Draw monsters
			if(monsterReady && self.state.monster.health > 0) {
				ctx.drawImage(monsterImage, self.state.monster.x, self.state.monster.y, monsterImage.width / 8, monsterImage.height / 8);
			}
			
			if(monsterReady2 && self.state.monster2.health > 0) {
				ctx.drawImage(monsterImage, self.state.monster2.x, self.state.monster2.y, monsterImage.width / 8, monsterImage.height / 8);
			}

			if(monsterReady2 && self.state.monster3.health > 0) {
				ctx.drawImage(monsterImage2, self.state.monster3.x, self.state.monster3.y, monsterImage2.width / 8, monsterImage2.height / 8);
			}

			if(monsterReady3 && self.state.monster4.health > 0) {
				ctx.drawImage(monsterImage2, self.state.monster4.x, self.state.monster4.y, monsterImage2.width / 8, monsterImage2.height / 8);
			}

			if(monsterReady3 && self.state.monster5.health > 0) {
				ctx.drawImage(monsterImage3, self.state.monster5.x, self.state.monster5.y, monsterImage3.width / 8, monsterImage3.height / 8);
			}

			if(monsterReady && self.state.monster6.health > 0) {
				ctx.drawImage(monsterImage3, self.state.monster6.x, self.state.monster6.y, monsterImage3.width / 8, monsterImage3.height / 8);
			}
			
			// Draw weapon
			if(weaponReady && self.state.weapon.status === false) {
				ctx.drawImage(weaponImage, self.state.weapon.x, self.state.weapon.y, weaponImage.width * 2, weaponImage.height * 2);
			}

			// Draw Golden Skull
			if(skullReady && self.state.hero.skull === false) {
				self.state.skull.x = 1058;
				self.state.skull.y = 60;
				ctx.drawImage(skullImage, 1058, 60, skullImage.width * 1.3, skullImage.height * 1.3);
			} else {
				self.state.skull.x = -900;
				self.state.skull.y = -900;
			}


			// Monster death detection for all six monsters.
			if(self.state.monster.health <= 0) {
				self.state.monster.y = -900;
				self.state.monster.x = -900;
				if(self.state.monster.dead === false) {
					killSound.play();
					self.state.monster.dead = true;
				}
			}

			if(self.state.monster2.health <= 0) {
				self.state.monster2.y = -900;
				self.state.monster2.x = -900;
				if(self.state.monster2.dead === false) {
					killSound.play();
					self.state.monster2.dead = true;
				}
			}

			if(self.state.monster3.health <= 0) {
				self.state.monster3.y = -900;
				self.state.monster3.x = -900;
				if(self.state.monster3.dead === false) {
					killSound.play();
					self.state.monster3.dead = true;
				}
			}

			if(self.state.monster4.health <= 0) {
				self.state.monster4.y = -900;
				self.state.monster4.x = -900;
				if(self.state.monster4.dead === false) {
					killSound.play();
					self.state.monster4.dead = true;
				}
			}

			if(self.state.monster5.health <= 0) {
				self.state.monster5.y = -900;
				self.state.monster5.x = -900;
				if(self.state.monster5.dead === false) {
					killSound.play();
					self.state.monster5.dead = true;
				}
			}

			if(self.state.monster6.health <= 0) {
				self.state.monster6.y = -900;
				self.state.monster6.x = -900;
				if(self.state.monster6.dead === false) {
					killSound.play();
					self.state.monster6.dead = true;
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
			if(self.state.hero.level == 2) {
				self.state.hero.health = 200;
				self.state.hero.maxHealth = 200;
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
			ctx.fillText("HP: "+self.state.hero.health+'/'+self.state.hero.maxHealth, 20, 710);

			ctx.fillStyle = "rgb(255, 255, 0)";
			ctx.fillText("Level: "+self.state.hero.level, 170, 710);
			ctx.fillStyle = "rgb(26, 198, 255)";
			ctx.fillText("Weapon: "+self.state.hero.weapon, 270, 710);
		}

		// The main game loop
		var main = function() {

			if(self.state.hero.health <= 0) {
				// Pause game music.
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
			} else if( doorPass == true) {
				console.log('win.');
				// Pause game music.
				sic.pause();
				winSound.currentTime = 0;
				winSound.play();
	
				// Clear the canvas
		        ctx.fillStyle = "#000000";
		        ctx.fillRect(0, 0, canvas.width, canvas.height);

				ctx.fillStyle = "rgb(0, 255, 0)";
				ctx.font = "50px Helvetica";
				ctx.textAlign = "center";
				ctx.textBaseline = "top";
				ctx.fillText("You win! Thank you for playing.", canvas.width / 2, canvas.height / 3);
				ctx.font = "20px Helvetica";
				ctx.fillStyle = "rgb(50, 255, 0)";
				ctx.fillText("(Press enter to play again)", canvas.width / 2, canvas.height / 2.4);
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

		// Detects if player presses the ENTER button to restart the game.
		addEventListener("keyup", function(e) {
			if(e.keyCode == 13 && (self.state.hero.health <= 0 || doorPass == true)) {
				if(doorPass == true) {
					winSound.pause();
					doorPass = false;
				}
				console.log('keypressed')
				// Revert all states to its initial state.
				self.setState(self.getInitialState());

				// Call the initializeGame function.
				dungeonGame.initializeGame();
				main();	
			}
		});

		// Start the game.
		generateObjects();
		main();
	},

	render: function() {
	    return <div>
    	<div className="logo"><img src="logo.png"></img></div>
		<canvas id='gameCanvas' height='750' width='1200'></canvas>
		<h4>Tip: Press spacebar to toggle visibility.&nbsp;&nbsp;<a href="https://github.com/sok213/ddd-crawler/blob/master/js/javascript.jsx" target="_blank">Source code</a> &nbsp;&nbsp;<a href="https://github.com/sok213/ddd-crawler/blob/master/credit.txt" target="_blank" id="creds">Credits</a></h4>
    </div>
	}
});

// Render the canvas to the DOM.
var dungeonGame = ReactDOM.render(<DungeonGame />, document.getElementById('body'));

// Initializes the game.
dungeonGame.initializeGame();