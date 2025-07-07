import { BaseScene } from "./BaseScene.js";

export class ManufacturerScene extends BaseScene{
    constructor(config){
        super("ManufacturerScene", config);
        this.config = config;

    }
    
    showInterface(){
        this.show(this.manufacturerScreen, "grid");
        this.manufacturerScreen.style.zIndex = -1;
    }
    preload(){
        this.showInterface()
        this.load.image("my_brand_logo", "images/my_brand_logo.png");
        this.load.audio("drop", "sounds/begin_game.wav");
    }
    create(){
        this.logo = this.add.image(0,0,"my_brand_logo").setOrigin(0).setScale(0.25);
        this.logo.setPosition(this.config.width/2 - this.logo.displayWidth/2, this.config.height/2 - this.logo.displayHeight);
        this.sound.add("drop").play();  
        this.tweens.add({
            targets: this.logo,
            y: this.config.height/2 - this.logo.displayHeight/2,
            duration: 300,
            ease: "Cubic",
            onComplete: ()=>{
                setTimeout(()=>{
                    this.scene.start("PreloadScene"); 
                }, 1000)
            }
        })
    }
}