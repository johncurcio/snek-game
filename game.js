import SnekScene from './SnekScene.js';
import HomeScene from './HomeScene.js';

window.onload = function(){
    var config = {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            width: 750,
            height: 1334
        },
        backgroundColor: '#9AC503',
        scene : [ HomeScene, SnekScene ]
    };

    var game = new Phaser.Game(config);
}

