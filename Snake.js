//  Direction consts
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;
var OFFSET = 16;

class Snake {

    constructor(scene, x, y){
        this.headPosition = new Phaser.Geom.Point(x, y);
        this.body = scene.add.group();

        this.head = this.body.create(x * OFFSET, y * OFFSET, 'body');
        this.head.setOrigin(0);
        this.alive = true;
        this.speed = 100;
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

    move(time){
        switch(this.heading){
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                break;
            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                break;
            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                break;
            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                break;
        }
        this.direction = this.heading;

        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * OFFSET, this.headPosition.y * OFFSET, 1, this.tail);

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

    speedUp(food, limit, foodEaten){
        if (this.speed > limit && food.total % foodEaten === 0) 
            this.speed -= 10;
    }

    collide(food){
        if (this.head.x === food.x && this.head.y === food.y){
            this.grow();
            food.eat();
            this.speedUp(food, 20, 5);
            return true;
        } else return false;
    }

    removeBodyFrom(grid){
        this.body.children.each(function(bodyPart){
            var bx = bodyPart.x / OFFSET;
            var by = bodyPart.y / OFFSET;
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