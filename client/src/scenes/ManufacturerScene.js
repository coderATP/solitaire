import { BaseScene } from "./BaseScene.js";
import domUI from "../ui/domUIManager.js";

export class ManufacturerScene extends BaseScene {
    constructor(config) {
        super("ManufacturerScene", config);
        this.config = config;
    }

    preload() {
        domUI.clear();

        this.dom = domUI.show(`
            <div class="manufacturer-screen">

                <img
                    src="/client/assets/images/atp_logo.png"
                    class="manufacturer-logo"
                    alt="ATP Game Studio"
                />

            </div>
        `);

        this.load.font(
            "myFont",
            "/client/assets/fonts/MarioWorldPixelColor-3zBwX.ttf",
            "truetype"
        );

        this.load.font(
            "myOtherFont",
            "/client/assets/fonts/Planes_ValMore.ttf",
            "truetype"
        );

        this.load.font(
            "myOtherOtherFont",
            "/client/assets/fonts/angrybirds-regular.ttf",
            "truetype"
        );

    }

    create() {
        const screen = this.dom.querySelector(
            ".manufacturer-screen"
        );

        requestAnimationFrame(() => {
            screen.classList.add("visible");
        });

        this.time.delayedCall(1800, () => {
            screen.classList.remove("visible");

            this.time.delayedCall(700, () => {
                this.shutdown();
                this.scene.start("PreloadScene");
            });
        });
    }

    shutdown() {
        domUI.clear();
    }
}