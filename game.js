import Snake from './Snake.js';
import Food from './Food.js';

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    backgroundColor: '#bfcc00',
    scene : {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var snake;
var food;
var cursors;

function preload(){
    this.load.image('food', 'assets/food.png');
    this.load.image('body', 'assets/body.png');
}

function create(){
    food = new Food(this, 3, 4);
    snake = new Snake(this, 8, 8);
    cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta){
    if (!snake.alive) return;

    if (cursors.left.isDown) {
        snake.faceLeft();
    } else if (cursors.right.isDown){
        snake.faceRight();
    } else if (cursors.up.isDown) {
        snake.faceUp();
    } else if (cursors.down.isDown) {
        snake.faceDown();
    }
    
    if (snake.update(time)) {
        if (snake.collide(food)) placeFood(40, 30);
    }
}

function placeFood(X, Y){
    var grid = [];
    for (let y = 0; y < Y; y++){
        grid[y] = [];
        for (let x = 0; x < X; x++){
            grid[y][x] = true;
        }
    }

    snake.removeBodyFrom(grid);

    var validLocations = [];
    for (let y = 0; y < Y; y++){
        for (let x = 0; x < X; x++){
            if (grid[y][x]) validLocations.push({ x : x, y : y });
        }
    }

    if (validLocations.length > 0){
        var pos = Phaser.Math.RND.pick(validLocations);
        food.setPosition(pos.x * 16 , pos.y * 16);
        return true;
    }
    return false;
}


