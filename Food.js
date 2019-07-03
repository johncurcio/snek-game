class Food extends Phaser.GameObjects.Image {

	constructor(scene, x, y, go){
		super(scene, x, y);
        this.gameOptions = go;

		Phaser.GameObjects.Image.call(this, scene);

		this.setTexture('food'); //food is an id.. maybe change to a param
		this.setPosition(x * this.gameOptions.frameRate, y * this.gameOptions.frameRate);
		this.setOrigin(0);

		this.total = 0;
		scene.children.add(this);
	}

	eat(){
		this.total++;

		var x = Phaser.Math.Between(0, 49);
		var y = Phaser.Math.Between(0, 39);
		this.setPosition(x * this.gameOptions.frameRate, y * this.gameOptions.frameRate);
	}

}

export default Food;