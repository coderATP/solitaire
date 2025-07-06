export class BaseScene extends Phaser.Scene{
    constructor(scene){
        super(scene);
        
        this.scene = scene;
        this.config = undefined;
        this.pauseScreen = document.getElementById("pauseScreen");
        this.confirmScreen = document.getElementById("confirmScreen");
        this.playScreenTop = document.getElementById("playScreenTop");
        this.playScreenBottom = document.getElementById("playScreenBottom");
        this.manufacturerScreen = document.getElementById("manufacturerScreen");
        this.preloadScreen = document.getElementById("preloadScreen");
        this.titleScreen = document.getElementById("titleScreen");
        this.playScreen = document.getElementById("playScreen");

        this.screens = [this.pauseScreen, this.confirmScreen, this.playScreenTop, this.playScreenBottom, this.manufacturerScreen, this.preloadScreen, this.titleScreen, this.playScreen];
    }
   
    hide(screen){
        screen.style.display = "none";
    }
    
    show(screen, display){
        screen.style.display = display;
    }
    hideAllScreens(){
        this.screens.forEach(screen=>{ screen.style.display = "none"; });
    }
     
}