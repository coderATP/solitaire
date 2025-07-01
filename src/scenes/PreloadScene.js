import { BaseScene } from "./BaseScene.js";

export class PreloadScene extends BaseScene{
    constructor(config) {
        super("BaseScene", config);
    }
    
    preload(){
        this.load.image("clickToStart", "../images/clickToStart.png");
        this.load.image("title", "../images/title.png");
        this.load.spritesheet("cards", "../images/cards.png",
            {frameWidth: 88, frameHeight: 128});
        this.load.audio('buttonClickSound', 'sounds/click.wav');
        this.load.audio('playSong', "sounds/overworld.ogg");
        this.load.audio('beginGameSound', "sounds/begin_game.wav");
        this.load.audio('drawSound', "sounds/draw.wav");
        this.load.audio('dropSound', "sounds/drop.wav");
        this.load.audio('errorSound', "sounds/error_sound.wav");
        this.load.audio('undoSound', "sounds/undo.wav");
        this.load.audio('shuffleSound', "sounds/shuffle.wav");

        this.load.on("complete", this.playSolitaire, this);
        
    }
    
    playSolitaire(){
        this.scene.start("TitleScene");
    }
    
    
}