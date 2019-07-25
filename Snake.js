//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

class Snake {

    constructor(scene, x, y, go){
        this.gameOptions = go;
        this.headPosition = new Phaser.Geom.Point(x, y);
        this.body = scene.add.group();

        this.head = this.body.create(x * this.gameOptions.frameRate, y * this.gameOptions.frameRate, 'body');
        this.head.setOrigin(0);
        this.alive = true;
        this.speed = this.gameOptions.snakeSpeed;
        this.moveTime = 0;
        this.heading = RIGHT;
        this.direction = RIGHT;

        this.tail = new Phaser.Geom.Point(x, y);
    }

    update(time){
        if (time >= this.moveTime){
            return this.move(time);
        }
    }

    changeDirection(time){
        switch(this.heading){
            case LEFT:
                this.faceUp();
                break;
            case RIGHT:
                this.faceDown();
                break;
            case UP:
                this.faceRight();
                break;
            case DOWN:
                this.faceLeft();
                break;
        }
    }

    move(time){
        switch(this.heading){
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, this.gameOptions.minScaleX, this.gameOptions.scaleX);
                break;
            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, this.gameOptions.minScaleX, this.gameOptions.scaleX);
                break;
            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, this.gameOptions.minScaleY, this.gameOptions.scaleY);
                break;
            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, this.gameOptions.minScaleY, this.gameOptions.scaleY);
                break;
        }
        this.direction = this.heading;

        Phaser.Actions.ShiftPosition(this.body.getChildren(), 
                this.headPosition.x * this.gameOptions.frameRate, 
                this.headPosition.y * this.gameOptions.frameRate, 1, this.tail);
        
        if (this.isDead()){
            console.log("snek can't come to the phone right now");
            this.alive = false;
            return false;
        } else {
            this.moveTime = time + this.speed;
            return true;
        }
    }

    faceLeft(){
        if (this.direction == UP || this.direction == DOWN) this.heading = LEFT;
    }

    faceRight(){
        if (this.direction == UP || this.direction == DOWN) this.heading = RIGHT;
    }

    faceUp(){
        if (this.direction == LEFT || this.direction == RIGHT) this.heading = UP;
    }

    faceDown(){
        if (this.direction == LEFT || this.direction == RIGHT) this.heading = DOWN;
    }

    grow(){
        var tailBody = this.body.create(this.tail.x, this.tail.y, 'body');
        tailBody.setOrigin(0);
    }

    speedUp(food, foodEaten){
        if (this.speed > this.gameOptions.snakeMaxSpeed && food.total % foodEaten === 0) 
            this.speed -= 5;
    }

    collide(food){
        if (this.head.x === food.x && this.head.y === food.y){
            this.grow();
            food.eat();
            this.speedUp(food, 10);
            return true;
        } else return false;
    }

    removeBodyFrom(grid){
        var self = this;
        this.body.children.each(function(bodyPart){
            var bx = bodyPart.x / self.gameOptions.frameRate;
            var by = bodyPart.y / self.gameOptions.frameRate;
            grid[by][bx] = false;
        });
        return grid;
    }

    isDead(){
        var dead = Phaser.Actions.GetFirst(
            this.body.getChildren(),
            { x: this.head.x, y: this.head.y },
            1
        );
        return dead;
    }
}

export default Snake;