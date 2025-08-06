import { BaseScene } from "./BaseScene.js";
import { AudioControl } from "../audio/AudioControl.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class TitleScene extends BaseScene{
    constructor(config){
        super("TitleScene", config);
        this.config = config;
    }
    
    showInterface(){
        const { PlayScene } = this.game.scene.keys;
        eventEmitter.destroy("ConfirmToTitle"); 
        eventEmitter.destroy("GameCompleteToMenu");
        this.hideAllScreens();
        this.showOne(this.titleScreen, "grid");
        this.scene.stop("PlayScene");
        if(PlayScene.audio) PlayScene.audio.playSong.stop();
    }
    create(){
        this.showInterface();
        this.audio = new AudioControl(this);
 
        this.title = this.add.image(0,0,"title").setOrigin(0).setScale(2);
        this.title.setPosition(this.config.width/2 - this.title.displayWidth/2, this.config.height/2 - this.title.displayHeight/2);
        this.clickToStart = this.add.text(0,0,"click anywhere to start",
        {font: "30px myFont"})
            .setOrigin(0)
            .setInteractive({draggable: false})
            .once("pointerdown", ()=>{
                
            })
        this.input.once("pointerdown", ()=>{
            eventEmitter.emit("MenuToPlay");
        })
        eventEmitter.once("MenuToPlay", ()=>{
            this.audio.buttonClickSound.play();
            this.scene.start("PlayScene");  
        })
        this.tweens.add({
            targets: this.clickToStart,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            duration: 1000
        })
        this.clickToStart.setPosition(this.config.width/2-this.clickToStart.displayWidth/2, this.title.y + this.title.displayHeight+30);
    }
}