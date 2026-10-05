import { BaseScene } from "./BaseScene.js";
import { AudioControl } from "../audio/AudioControl.js";
import { eventEmitter } from "../events/EventEmitter.js";
import domUI from "../ui/domUIManager.js";

export class MenuScene extends BaseScene{

    constructor(config){
        super("MenuScene", config);
        this.config = config;
    }

    injectUI(){
        this.dom = domUI.show(`
            <section id="solitaire-menu-root">
                <div id="solitaire-menu-content">
                    <img
                        id="solitaire-menu-title"
                        src="/client/assets/images/title.png"
                        alt="Solitaire"
                    >
                    <div id="solitaire-menu-start">
                        CLICK ANYWHERE TO START
                    </div>
                </div>
            </section>
        `);

        this.title =
            this.dom.querySelector(
                "#solitaire-menu-title"
            );

        this.clickToStart =
            this.dom.querySelector(
                "#solitaire-menu-start"
            );
    }

    create(){
        eventEmitter.destroy("ConfirmToTitle");
        eventEmitter.destroy("GameCompleteToMenu");

        this.scene.stop("PlayScene");

        domUI.clear();
        this.injectUI();

        this.audio =
            new AudioControl(this);

        this.dom.addEventListener(
            "click",
            () => {
                eventEmitter.emit("MenuToPlay");
            },
            { once: true }
        );

        eventEmitter.once(
            "MenuToPlay",
            () => {
                this.audio.buttonClickSound.play();

                domUI.clear();

                this.scene.start("PlayScene");
            }
        );
    }

    shutdown(){
        domUI.clear();
    }
}