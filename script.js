import { ManufacturerScene } from "./client/src/scenes/ManufacturerScene.js";
import { PreloadScene } from "./client/src/scenes/PreloadScene.js";
import { MenuScene } from "./client/src/scenes/MenuScene.js";
import { PauseScene } from "./client/src/scenes/PauseScene.js";
import { GameCompleteScene } from "./client/src/scenes/GameCompleteScene.js";
import { PlayScene } from "./client/src/scenes/PlayScene.js";
import { PlaybookScene } from "./client/src/scenes/PlaybookScene.js";


const GAME_WIDTH = window.innerWidth * 2;
const GAME_HEIGHT = window.innerHeight * 2;
const ZOOM_FACTOR = 1;


const SHARED_CONFIG = {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    
    topLeft: {
        x: 0,
        y: 0
    },
    
    topRight: {
        x: GAME_WIDTH,
        y: 0
    },
    
    bottomRight: {
        x: GAME_WIDTH,
        y: GAME_HEIGHT
    },
    
    debug: true
};


const config = {
    type: Phaser.CANVAS,
    
    ...SHARED_CONFIG,
    
    parent: "gameWrapper",
    
    backgroundColor: 0x00ff00,
    
    transparent: true,
    
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.NO_CENTER
    },
    
    pixelArt: false,
    
    physics: {
        default: "arcade",
        
        arcade: {
            debug: SHARED_CONFIG.debug
        },
        
        matter: {
            debug: SHARED_CONFIG.debug
        }
    },
    
    scene: [
        new ManufacturerScene(SHARED_CONFIG),
        new PreloadScene(SHARED_CONFIG),
        new MenuScene(SHARED_CONFIG),
        new PlayScene(SHARED_CONFIG),
        new PauseScene(SHARED_CONFIG),
        new PlaybookScene(SHARED_CONFIG),
        new GameCompleteScene(SHARED_CONFIG)
    ]
};


new Phaser.Game(config);