export class BaseScene extends Phaser.Scene{
    constructor(scene){
        super(scene);
        
        this.scene = scene;
        this.config = undefined;
        this.pauseScreen = document.getElementById("pauseScreen");
        this.confirmScreen = document.getElementById("confirmScreen");
        this.playScreenTop = document.getElementById("playScreenTop");
        this.playScreenBottom = document.getElementById("playScreenBottom");
        
    }
   
    hide(screen){
        screen.style.display = "none";
    }
    
    show(screen, display){
        screen.style.display = display;
    }
     
}