class HomeScene extends Phaser.Scene {
    
    constructor(){
        super("HomeScene");
    }

    preload(){
    	this.load.image('snake', 'assets/home.png');
    }

    create(){
    	this.snake = this.add.image(750 / 2, 1334 / 2.5, 'snake');

    	var text = this.add.text(200, 900, 'PRESS SPACE', 
    			{ fontFamily: 'font1', fontSize: '50px', fill: '#000' });

        this.input.keyboard.on('keydown-SPACE', function () {

            text.destroy();
            this.snake.destroy();
            this.scene.launch('Snek');

        }, this);
    }

    update(){}
}

export default HomeScene;