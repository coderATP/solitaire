import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class ConfirmScene extends BaseScene{
    constructor(config){
        super("ConfirmScene", config);
        this.config = config;

    }
    
    showInterface(){
        this.hideOne(this.pauseScreen);
        this.showOne(this.confirmScreen, "grid", 0)
    }

    create(){
        this.gamePaused = true;
        this.showInterface();
        this.handleConfirm();
    }
    handleConfirm(){
        let clicked = false;
        const { PauseScene, PlayScene } = this.game.scene.keys;
        noBtn.addEventListener("click", ()=>{
            eventEmitter.emit("ConfirmToPause");
        })
        yesBtn.addEventListener("click", ()=>{
            if(PlayScene.confirmText.innerText === "Return to Menu?") eventEmitter.emit("ConfirmToTitle");
        
            else if(PlayScene.confirmText.innerText === "Restart?") eventEmitter.emit("ConfirmToRestart");
        }) 
        eventEmitter.once("ConfirmToPause", ()=>{
            PlayScene.audio.popUpSound.play();
            this.scene.start("PauseScene");
        })
        eventEmitter.once("ConfirmToTitle", ()=>{
            PlayScene.audio.popUpSound.play();
            this.scene.start("TitleScene");
        })
        eventEmitter.once("ConfirmToRestart", ()=>{
            PlayScene.audio.popUpSound.play();
            this.hideOne(this.confirmScreen);
            PlayScene.watch.resetWatch(PlayScene.ui.timeText).setUpWatch(PlayScene.ui.timeText);
            PlayScene.solitaire.onClickRestartButton();
            this.scene.stop();
            if(this.scene.isPaused("PlayScene")) this.scene.resume("PlayScene");
        })  
    
    }

}