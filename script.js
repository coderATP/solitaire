import { PreloadScene } from "./src/scenes/PreloadScene.js";
import { PlayScene } from "./src/scenes/PlayScene.js";


const GAME_WIDTH = innerWidth;
const GAME_HEIGHT = innerHeight;
const ZOOM_FACTOR = 1.38


const SHARED_CONFIG = {
    width: GAME_WIDTH, 
    height: GAME_HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    topLeft: {
        x: ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2,
        y: ( GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2,
    },
    topRight: {
        x: ( ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2 ) + (GAME_WIDTH/ZOOM_FACTOR),
        y: ( GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2,
    },
    bottomRight: {
        x: ( ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2 ) + (GAME_WIDTH/ZOOM_FACTOR),
        y: ( (GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2 ) + (GAME_HEIGHT/ZOOM_FACTOR),
    },
    debug: true
};

const config= {
    type: Phaser.AUTO,
    ...SHARED_CONFIG, 
    parent: "gameWrapper",
    backgroundColor: 0x00aa00,
    scale: {
         mode: Phaser.Scale.Fit,
         autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: false, 
    physics:{
        default: 'arcade',
        arcade:{
            debug: SHARED_CONFIG.debug,
        },
        matter:{
            debug: SHARED_CONFIG.debug,
        },

    },
    scene: [
        new PreloadScene(SHARED_CONFIG),
        new PlayScene(SHARED_CONFIG) ],
};

new Phaser.Game(config);