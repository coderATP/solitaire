import { BaseScene } from "./BaseScene.js";
import { AudioControl } from "../audio/AudioControl.js";

export class TitleScene extends BaseScene{
    constructor(config){
        super("TitleScene", config);
        this.config = config;
    }
    
    create(){
        this.title = this.add.image(0,0,"title").setOrigin(0).setScale(0.5);
        this.title.setPosition(this.config.width/2 - this.title.displayWidth/2, this.config.height/2 - this.title.displayHeight);
        this.clickToStart = this.add.image(0,0,"clickToStart")
            .setOrigin(0)
            .setScale(0.5)
            .setInteractive({draggable: false})
            .once("pointerdown", ()=>{
                new AudioControl(this).buttonClickSound.play();
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