var canvas = document.getElementById("canvasRunner");
var ctx = canvas.getContext("2d");

//Add listener for listen

window.addEventListener("keydown", keyController, false);

// Declared KeyCodes jump (SPACE) 

var keycode_jump = 32; // KeyCode jump (SPACE) 
var keycode_restart = 82; // KeyCode restart (R)

//Function to control all button presses

function keyController(e) {
  if (e.keyCode == keycode_jump) {
    riderJump() //After pressing the button, the function will be called
  }
  if (e.keyCode == keycode_restart) {
    startGame(); //After pressing the button, the function will be called
  }
}

function updateGameArea() {
  game.updateArea();
}

function riderJump() {
  rider.jump();
}

function startGame() {
  game.start();
}

//Game sounds

//Function to declare sound

function sound(src) {
  this.sound = new Audio(); // Declare new Audio
  this.sound.src = src; // Set source of sound
  document.body.appendChild(this.sound); // Make this sound as a child body
  this.play = function () { // Function play sound
    this.sound.play();
  }
  this.stop = function () { // Function stop playing sound
    this.sound.pause();
  }
}

//Sounds

var soundJump = new sound("sounds/jump.wav"); // Declare new sound
var soundLevelUp = new sound("sounds/levelUp.wav"); // Declare new sound
var soundLose = new sound("sounds/lose.wav"); // Declare new sound

//Sprites

var spriteRider = new Image(); // Declare sprite of rider
spriteRider.src = "sprites/horse.png"; // Sprite source

var spriteBackGround = new Image(); // Declare sprite of background
spriteBackGround.src = "sprites/background.png"; // Sprite source

var spritesWalls = []; // Declare array sprite walls
spritesWalls.push(new Image()); // Add to array sprite
spritesWalls.push(new Image()); // Add to array sprite
spritesWalls.push(new Image()); // Add to array sprite
spritesWalls[0].src = "sprites/wall1.png"; // Sprite source 
spritesWalls[1].src = "sprites/wall2.png"; // Sprite source
spritesWalls[2].src = "sprites/wall3.png"; // Sprite source



function lose() {
  ctx.font = "30px verdana";
  ctx.strokeText("Game Over! Press R", 150, 90);
}

// Global variables of game objects

var rider; // Declare variable contains game object "rider"
var walls = []; // Declare array walls
var background = []; // Declare array backgrounds
var scoreText; // Declare text score
var scoreToNextLevelText; // Declare text how much do you need to the next level


// Object of game

var game = {
  speed: 4, // Game speed
  gravity: 10, // Gravity game
  currentWall: 0, // Property which contains index of current wall
  currentBackGround: 0, // Property which contains index of current background
  interval: 0, // Game Interval
  score: 0, // Current score
  scoreToNextLevel: 500, // Property which contains how much do you need to the next level
  gameEnd: false, // Game end or not
  start: function () { // Function start game
    // Resets all game properties
    this.gameEnd = false;
    this.score = 0;
    this.scoreToNextLevel = 500;
    this.clear();
    this.currentWall = 0;
    this.currentBackGround = 0;
    background = [];
    walls = [];
    background[0] = new gameObject(500, 25, "green", 150, 0, "background", spriteBackGround);
    rider = new gameObject(25, 25, "green", 50, 0, "rider", spriteRider);
    scoreText = new gameObject(20, 20, "black", 485, 20, "score");
    scoreToNextLevelText = new gameObject(20, 20, "grey", 380, 20, "scoreNext");
    walls[0] = new gameObject(40, 40, "blue", 600, 100, "wall", spritesWalls[0]);
    clearInterval(this.interval);
    this.interval = setInterval(updateGameArea, 15);
  },
  clear: function () { // Cleans the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  updateArea: function () {
    if (!this.gameEnd) { // The game is on only if property gameEnd = false
      if (this.score >= this.scoreToNextLevel) {
        soundLevelUp.play(); // Play sound level up
        game.speed += 0.5; // Up speed
        this.scoreToNextLevel += 500;
      }
      this.score += 1; // Iterate game score
      this.clear(); // Clean the canvas
      for (var i = 0; i < background.length; ++i) { // Update all backgrounds
        background[i].update();
      }
      rider.update(); // Update rider
      scoreText.update(); // Update score text
      scoreToNextLevelText.update(); // Update score text
      for (var i = 0; i < walls.length; ++i) { // Update all walls
        walls[i].update();
      }

      if (rider.x >= walls[this.currentWall].x) { // Condition for create new wall
        game.createWall();
      }
      if (rider.x >= background[this.currentBackGround].x) { // Condition for create new background
        game.createBackGround();
      }
    }
  },
  createBackGround: function () {
    if (background.length >= 3) { // Control amount background
      for (var i = 0; i < background.length - 3; ++i) {
        background.shift();
        --this.currentBackGround;
      }
    }
    background.push(new gameObject(500, 30, "green", 628, 0, "background", spriteBackGround)); // Create new background
    ++this.currentBackGround;
  },
  createWall: function () {
    if (walls.length >= 5) { // Control amount walls
      for (var i = 0; i < walls.length - 5; ++i) {
        walls.shift();
        --this.currentWall;
      }
    }
    var minRangeWalls = 200;
    var maxRangeWalls = 300;
    var maxCountWalls = 5;
    var currentWall_X = 550;
    var countWalls = 1;
    var countWalls = Math.floor(Math.random() * maxCountWalls) + 1;
    for (var i = 0; i < countWalls; ++i) {
      var position_X = currentWall_X + Math.floor(Math.random() * maxRangeWalls) + minRangeWalls;
      var width = Math.floor(Math.random() * 40) + 10; // Calculate wall width
      var height = Math.floor(Math.random() * 40) + 20; // Calculate wall height
      var randomWall = Math.floor(Math.random() * 0) + 2; // Wall sprite
      walls.push(new gameObject(width, height, "blue", position_X, 100, "wall", spritesWalls[randomWall])); // Create new wall
      currentWall_X = position_X;
      ++this.currentWall;
    }
  }

};

// Template game object
function gameObject(width, height, color, x, y, type, sprite) {
  this.width = width;
  this.height = height;
  this.color = color;
  this.x = x;
  this.y = y;
  this.type = type;
  this.isJumping = true;
  this.speedJump = 0;
  this.sprite = sprite;
  this.update = function () {
    if (this.type == "rider") {
      this.check_collision();
      if (this.isJumping) {
        this.jumpCounter();
      }
      if (!this.hitBottom()) {
        this.fallDown();
      }
      ctx.fillStyle = this.color;
      ctx.drawImage(this.sprite, this.x, this.y);
    }
    if (this.type == "wall") {
      ctx.fillStyle = this.color;
      this.x = this.x - game.speed; // Move wall
      ctx.drawImage(this.sprite, this.x, this.y);
    }
    if (this.type == "score") {
      var size = (this.height + this.width) / 2;
      ctx.fillStyle = this.color;
      ctx.font = size + "px verdana";
      ctx.fillText(game.score, this.x, this.y);
    }
    if (this.type == "scoreNext") {
      var size = (this.height + this.width) / 2; // Set size text
      ctx.fillStyle = this.color;
      ctx.font = size + "px verdana";
      var scoreN = "NL " + game.scoreToNextLevel;
      ctx.fillText(scoreN, this.x, this.y);
    }
    if (this.type == "background") {
      this.x = this.x - game.speed; // Move background
      ctx.fillStyle = this.color;
      ctx.drawImage(this.sprite, this.x, this.y);
    }
  }
  this.hitBottom = function () { // Check collision with ground
    if (this.y + this.height >= canvas.height - 23) {
      return true;
    }
    return false;
  }
  this.fallDown = function () { // The fall rider
    this.y += game.gravity;
  }
  this.jump = function () {
    if (!this.isJumping) {
      this.speedJump = game.gravity * 2;
      soundJump.play();
      this.isJumping = true;
    }
  }
  this.jumpCounter = function () {
    this.speedJump -= 0.5;
    this.y -= this.speedJump;
    if (this.speedJump <= 0) {
      this.isJumping = false;
      this.speedJump = 0;
    }
  }
  this.check_collision = function () {
    if (this.type == "rider") {
      for (var i = 0; i < walls.length; ++i) { //Check collision with wall

        if ((this.x >= walls[i].x - this.width) && (this.x <= walls[i].x + walls[i].width) &&
          (this.y >= walls[i].y - this.height) && (this.y <= walls[i].y + walls[i].height)) {
          soundLose.play();
          lose();
          game.gameEnd = true;
        }
      }
    }
  }
}