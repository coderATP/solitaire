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
        this.load.audio("pop_up", "sounds/pop_up.ogg");
    }
    create(){
        this.logo = this.add.image(0,0,"my_brand_logo").setOrigin(0).setScale(1);
        this.logo.setPosition(this.config.width/2 - this.logo.displayWidth/2, this.config.height/2 - this.logo.displayHeight);
        this.sound.add("pop_up").play();  
        this.tweens.add({
            targets: this.logo,
            y: this.config.height/2 - this.logo.displayHeight/2,
            duration: 500,
            ease: "Cubic",
            onComplete: ()=>{
                setTimeout(()=>{
                    this.scene.start("PreloadScene"); 
                }, 2000)
            }
        })
    }
}