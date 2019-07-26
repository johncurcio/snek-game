import Snake from './Snake.js';
import Food from './Food.js';

var gameOptions = {
    // speed of movement - should be constant
    frameRate: 16,
    
    // the scale regulates the size of the screen available for the snake (it should stop at the rectangle)
    scaleX: 44,
    scaleY: 80,
    minScaleX: 3,
    minScaleY: 6,

    // speed regulates how fast the snake moves initially and after eating
    snakeSpeed: 70,
    snakeMaxSpeed: 20,

    // size of the screen
    width: 750,
    height: 1334,

    initRectX: 50,
    initRectY: 100,

    //special food constants
    specialFoodCount: 5,
    foodEatenCount: 5
}

class SnekScene extends Phaser.Scene {
    constructor(){
        super("Snek");
    }

    preload(){
        this.load.image('food', 'assets/food.png');
        this.load.image('spider', 'assets/spider.png');
        this.load.image('alien', 'assets/alien.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('body', 'assets/body.png');
        this.load.audio('eat', 'assets/audio/eat.wav', { instances: 1 });
        this.load.audio('gameover', 'assets/audio/gameover.wav', { instances: 1 });
    }

    create(){
        this.foodCount = 0;
        this.score = 0;
        
        //timer
        this.resetTimer();
        this.timeText = this.add.text(gameOptions.width-gameOptions.initRectX-75, gameOptions.initRectY-80
            , this.pad(this.timer.repeatCount, 2), {
            fontFamily: 'font1',
            fontSize: '100px',
            color: '#000'
        });
        this.timeText.alpha = 0;
        this.foodImage = this.add.image(gameOptions.width-gameOptions.initRectX-120, 
            gameOptions.initRectY-30, 'spider');
        this.foodImage.scale = 2;
        this.foodImage.alpha = 0;

        this.scoreText = this.add.text(gameOptions.initRectX, gameOptions.initRectY-80, this.pad(this.score, 4), {
            fontFamily: 'font1',
            fontSize: '100px',
            color: '#000'
        });

        // food types
        this.food = new Food(this, 30, 20, gameOptions, 'food');
        this.spider = new Food(this, -30, -20, gameOptions, 'spider');
        this.alien = new Food(this, -30, -20, gameOptions, 'alien');
        this.ship = new Food(this, -30, -20, gameOptions, 'ship');
        this.specialFoodArr = [this.spider, this.alien, this.ship];

        this.snake = new Snake(this, 20, 20, gameOptions);
        this.cursors = this.input.keyboard.createCursorKeys();
        var graphics = this.add.graphics({ 
                        lineStyle: { width: 10, color: 0x000000 }, 
                        fillStyle: { color: 0x9AC503 }
                    });
        var rect = new Phaser.Geom.Rectangle(gameOptions.initRectX, 
                                            gameOptions.initRectY, 
                                            gameOptions.width-100, 
                                            gameOptions.height-150);
        graphics.strokeRectShape(rect);
        this.sound.add('eat');
        this.sound.add('gameover');
    }

    gameOver(){
        this.sound.play('gameover');
        this.scene.start("Snek");
    }

    updateScore(food){
        this.score += food.worth();
        this.scoreText.setText(this.pad(this.score, 4));
    }

    pad(num, size) {
        var s = "000" + num;
        return s.substr(s.length-size);
    }

    update(time, delta){
        if (!this.snake.alive){
            this.gameOver();
            return;
        }

        this.input.on('pointerdown', function () {
            this.snake.changeDirection();
        }, this);

        if (this.cursors.left.isDown) {
            this.snake.faceLeft();
        } else if (this.cursors.right.isDown){
            this.snake.faceRight();
        } else if (this.cursors.up.isDown) {
            this.snake.faceUp();
        } else if (this.cursors.down.isDown) {
            this.snake.faceDown();
        }

        if (this.foodCount >= gameOptions.foodEatenCount){
            let specialFood = Phaser.Math.RND.pick(this.specialFoodArr);
            this.specialFoodSpawn(specialFood);
        }
        
        // should be a function
        if (this.snake.update(time)) {
            if (this.snake.collide(this.food)){
                this.foodCount += 1;
                this.sound.play('eat');
                this.updateScore(this.food);
                this.placeFood(gameOptions.scaleX-1, gameOptions.scaleY-1);
            }

            this.collideSpecialFood(this.spider);
            this.collideSpecialFood(this.alien);
            this.collideSpecialFood(this.ship);
        }

        if (this.timer.repeatCount >= 0) {
            this.timeText.setText(this.pad(this.timer.repeatCount, 2));
        }
    }

    resetTimer(){
        this.timer = this.time.addEvent({ delay: 1000, callbackScope: this, repeat: 0 });
    }

    countDownTimer(count, specialFood){
        this.timer = this.time.addEvent({ 
            delay: 1000, 
            callback: () => this.onEvent(specialFood), 
            callbackScope: this, 
            repeat: count
        });
    }

    onEvent(specialFood){
        if (this.timer.repeatCount <= 0){
            specialFood.setPosition(-20 , -30);
            this.foodCount = 0;
            this.timeText.alpha = 0; // erases the timeText
            this.foodImage.alpha = 0; // erases the foodImage
        }
    }

    specialFoodSpawn(specialFood){
        this.timeText.alpha = 1; // make timeText visible
        this.foodImage = this.add.image(gameOptions.width-gameOptions.initRectX-120, 
            gameOptions.initRectY-30, specialFood.foodType);
        this.foodImage.scale = 2;
        this.foodImage.alpha = 1;
        specialFood.setPosition(20 * gameOptions.frameRate , 30 * gameOptions.frameRate);
        this.countDownTimer(gameOptions.specialFoodCount, specialFood);
        this.foodCount = 0;
    }

    collideSpecialFood(specialFood){
        if (this.snake.collide(specialFood)){
            this.sound.play('eat');
            this.updateScore(this.spider);
            specialFood.setPosition(-20 , -30);
            this.resetTimer();
        }
    }

    placeFood(X, Y){
        var grid = []; // grid with all locations I can place food or not
        var initX = parseInt(gameOptions.initRectX / gameOptions.frameRate) + 1;
        var initY = parseInt(gameOptions.initRectY / gameOptions.frameRate) + 1;

        for (let y = 0; y < Y + 1; y++){
            grid[y] = [];
            for (let x = 0; x < X + 1; x++){
                grid[y][x] = true;
            }
        }

        this.snake.removeBodyFrom(grid);

        var validLocations = [];
        for (let y = initY; y < Y; y++){
            for (let x = initX; x < X; x++){
                if (grid[y][x]) validLocations.push({ x : x, y : y });
            }
        }

        if (validLocations.length > 0){
            var pos = Phaser.Math.RND.pick(validLocations);
            this.food.setPosition(pos.x * gameOptions.frameRate , pos.y * gameOptions.frameRate);
            return true;
        }
        return false;
    }
}

export default SnekScene;