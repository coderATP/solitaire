import { BaseScene } from "./BaseScene.js";

export class PreloadScene extends BaseScene{
    constructor(config) {
        super("BaseScene", config);
    }
    
    preload(){
        this.load.image("clickToStart", "../images/clickToStart.png");
        this.load.image("title", "../images/title.png");
        this.load.spritesheet("cards", "../images/cards.png",
            {frameWidth: 37, frameHeight: 52});
        
        this.load.on("complete", this.playSolitaire, this);
        
    }
    
    playSolitaire(){
        this.scene.start("PlayScene");
    }
    
    
}