var OFFSET = 16;

class Food extends Phaser.GameObjects.Image {

	constructor(scene, x, y){
		super(scene, x, y);

		Phaser.GameObjects.Image.call(this, scene);

		this.setTexture('food'); //food is an id.. maybe change to aparam
		this.setPosition(x*OFFSET, y*OFFSET);
		this.setOrigin(0);

		this.total = 0;
		scene.children.add(this);
	}

	eat(){
		this.total++;
		var x = Phaser.Math.Between(0, 39);
		var y = Phaser.Math.Between(0, 29);
		this.setPosition(x*OFFSET, y*OFFSET);
	}

}

export default Food;