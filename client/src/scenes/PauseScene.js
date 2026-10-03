import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class PauseScene extends BaseScene{
    constructor(config){
        super("PauseScene", config);
        this.config = config;
        this.gamePaused = true;
    }
    
    showInterface(){
        this.hideOne(this.confirmScreen);
        this.showOne(this.pauseScreen, "grid", 0);
    }

    create(){
        //this.gamePaused = true;
        this.showInterface();
        this.handleGamePause();
        this.processEvents();
    }
    processEvents(){
        const { PlayScene } = this.game.scene.keys;
        eventEmitter.once("PauseToConfirm", ()=>{
            PlayScene.audio.popUpSound.play();
            this.scene.start("ConfirmScene");
        })
    }
    handleGamePause(){
        const { PlayScene } = this.game.scene.keys;
        PlayScene.watch.stopWatch();
        this.confirmText = document.getElementById("confirmText");
        //RESUME
        pause_resumeBtn.addEventListener('click', ()=>{
            if(this.gamePaused){
                PlayScene.watch.resumeWatch(PlayScene.ui.timeText);
                this.scene.stop();
                if(this.scene.isPaused("PlayScene")) this.scene.resume("PlayScene");
                PlayScene.audio.play(PlayScene.audio.buttonClickSound);
                PlayScene.showInterface();
                this.gamePaused = false; 
            }
            
        })
        //menu
        pause_menuBtn.addEventListener('click', ()=>{
            this.confirmText.innerText = "Return to Menu?" 
            eventEmitter.emit("PauseToConfirm");
        })
        //RESTART
        pause_restartBtn.addEventListener('click', ()=>{
            this.confirmText.innerText = "Restart?"
            eventEmitter.emit("PauseToConfirm");
        })
        
    }
}