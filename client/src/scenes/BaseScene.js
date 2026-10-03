export class BaseScene extends Phaser.Scene{
    constructor(scene){
        super(scene);
        
        this.scene = scene;
        this.config = undefined;
        this.pauseScreen = document.getElementById("pauseScreen");
        this.confirmScreen = document.getElementById("confirmScreen");
        this.playScreenTopUI = document.getElementById("playScreenTop");
        this.playScreenBottomUI = document.getElementById("playScreenBottom");
        this.manufacturerScreen = document.getElementById("manufacturerScreen");
        this.preloadScreen = document.getElementById("preloadScreen");
        this.titleScreen = document.getElementById("titleScreen");
        this.playScreen = document.getElementById("playScreen");
        this.levelCompleteScreen = document.getElementById("levelCompleteScreen");
        this.screens = [this.pauseScreen, this.confirmScreen, this.playScreenTopUI, this.playScreenBottomUI, this.manufacturerScreen, this.preloadScreen, this.titleScreen, this.playScreen, this.levelCompleteScreen];
    }
    hideOne(screen){
        screen.style.display = "none";
        screen.style.zIndex = -1;
    }
    showOne(screen, display, zIndex = -1){
        screen.style.display = display;
        screen.style.zIndex = zIndex;
    } 
    hideMultiple(screens){
        screens.forEach(screen=>{
            screen.style.zIndex = -1;
            screen.style.display = "none";
        })
        return screens;
    }
    
    showMultiple(screens, display, zIndex = -1){
        screens.forEach(screen=>{
            screen.style.zIndex = zIndex;
            screen.style.display = display;
        }) 
        return screens;
    }
    hideAllScreens(){
        this.screens.forEach(screen=>{
            screen.style.zIndex = -1; 
            screen.style.display = "none";
        });
        return this.screens;
    }
     
}