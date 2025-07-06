import { BaseScene } from "./BaseScene.js";
import { AudioControl } from "../audio/AudioControl.js";

export class TitleScene extends BaseScene{
    constructor(config){
        super("TitleScene", config);
        this.config = config;

    }
    
    showInterface(){
        this.hideAllScreens();
        this.show(this.titleScreen, "grid");
        this.titleScreen.style.zIndex = -1;
    }
    create(){
        this.showInterface();
        this.audio = new AudioControl(this);
 
        this.title = this.add.image(0,0,"title").setOrigin(0).setScale(0.25);
        this.title.setPosition(this.config.width/2 - this.title.displayWidth/2, this.config.height/2 - this.title.displayHeight/2);
        this.clickToStart = this.add.text(0,0,"click anywhere to start",
        {font: "15px myFont"})
            .setOrigin(0)
            .setInteractive({draggable: false})
            .once("pointerdown", ()=>{
                
            })
        this.input.on("pointerdown", ()=>{
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