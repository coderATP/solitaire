import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import domUI from "../ui/domUIManager.js";
import NotificationModal from "../ui/NotificationModal.js";

export class PauseScene extends BaseScene{

    constructor(config){
        super("PauseScene", config);

        this.config = config;
        this.gamePaused = false;
    }

    injectUI(){
        this.dom = domUI.show(`
            <section id="solitaire-pause-root">

                <div id="solitaire-pause-header">

                    <div id="solitaire-pause-title">
                        PAUSED
                    </div>

                    <button id="solitaire-pause-resume-btn">
                        X
                    </button>

                </div>

                <div id="solitaire-pause-buttons">

                    <button id="solitaire-pause-playbook-btn">
                        PLAYBOOK
                    </button>

                    <button id="solitaire-pause-restart-btn">
                        RESTART
                    </button>
                    <button id="solitaire-pause-menu-btn">
                        MENU
                    </button>
                </div>

            </section>
        `);

        this.resumeBtn =
            this.dom.querySelector(
                "#solitaire-pause-resume-btn"
            );

        this.menuBtn =
            this.dom.querySelector(
                "#solitaire-pause-menu-btn"
            );

        this.restartBtn =
            this.dom.querySelector(
                "#solitaire-pause-restart-btn"
            );
        this.playbookBtn =
            this.dom.querySelector(
                "#solitaire-pause-playbook-btn"
            );
    }

    create(){
        domUI.clear();

        this.injectUI();

        this.handleGamePause();
    }

    handleGamePause(){
        const { PlayScene } =
            this.game.scene.keys;

        PlayScene.watch.stopWatch();

        this.gamePaused = true;

        this.resumeBtn.addEventListener(
            "click",
            () => {

                if(!this.gamePaused){
                    return;
                }

                domUI.clear();

                this.gamePaused = false;

                this.scene.stop();

                if(
                    this.scene.isPaused(
                        "PlayScene"
                    )
                ){
                    this.scene.resume(
                        "PlayScene"
                    );
                }

                PlayScene.audio.play(
                    PlayScene.audio.buttonClickSound
                );
            },
            { once: true }
        );

        this.menuBtn.addEventListener(
            "click",
            () => {

                NotificationModal.open({
                    title: "RETURN TO MENU?",
                    message:
                        "Are you sure you want to return to the menu?",
                    type: "warning",
                    showCancel: true,
                    confirmText: "Yes",
                    cancelText: "No",

                    onConfirm: () => {

                        domUI.clear();

                        this.gamePaused = false;

                        this.scene.stop();

                        this.scene.stop(
                            "PlayScene"
                        );

                        this.scene.start(
                            "MenuScene"
                        );
                    }
                });
            }
        );

        this.restartBtn.addEventListener(
            "click",
            () => {

                NotificationModal.open({
                    title: "RESTART GAME?",
                    message:
                        "Are you sure you want to restart the game?",
                    type: "warning",
                    showCancel: true,
                    confirmText: "Yes",
                    cancelText: "No",

                    onConfirm: () => {

                        domUI.clear();

                        this.gamePaused = false;

                        this.scene.stop();

                        this.scene.stop(
                            "PlayScene"
                        );

                        this.scene.start(
                            "PlayScene"
                        );
                    }
                });
            }
        );
        
        this.playbookBtn.addEventListener('click', ()=>{
            
            this.scene.start('PlaybookScene');
            
        })
    }

    shutdown(){
        domUI.clear();
    }
}