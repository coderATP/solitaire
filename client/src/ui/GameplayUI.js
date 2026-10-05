import { Button } from "../entities/Button.js";

export class GameplayUI{

    constructor(scene){
        this.scene = scene;
        this.config = scene.config;

        this.createButtons();
        this.getPiles();
        this.updateLayout();
    }

    createButtons(){
        this.scoreBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "0",
                "score"
            );

        this.movesBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "0",
                "moves"
            );

        this.timeBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "00:00",
                "time"
            );

        this.pauseBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "Pause",
                "pause"
            );

        this.hintBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "Hint",
                "hint"
            );

        this.undoBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "Undo",
                "undo"
            );

        this.settingsBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "Settings",
                "settings"
            );

        this.instructionsBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "Instructions",
                "instructions"
            );

        this.leaderboardBtn =
            new Button(
                this.scene,
                new Phaser.Geom.Rectangle(0, 0, 100, 100),
                "Leaderboard",
                "leaderboard"
            );

        this.topButtons = [
            this.scoreBtn,
            this.movesBtn,
            this.timeBtn,
            this.pauseBtn,
            this.hintBtn
        ];

        this.bottomButtons = [
            this.undoBtn,
            this.settingsBtn,
            this.instructionsBtn,
            this.leaderboardBtn
        ];

        this.buttons = [
            ...this.topButtons,
            ...this.bottomButtons
        ];

        this.buttons.forEach(button => {
            button.setBackgroundColor(
                0x22aa22,
                0x000000,
                1,
                4,
                1
            );
        });

        return this;
    }

    updatePileRectGraphics(){
        this.scene.graphics.clear();

        this.scene.graphics.lineStyle(
            1,
            0xffffff,
            1
        );

        const drawPile = this.drawPile;

        if(drawPile && drawPile.rect){
            this.scene.graphics.strokeRectShape(
                drawPile.rect
            );
        }

        const discardPile = this.discardPile;

        if(discardPile && discardPile.rect){
            this.scene.graphics.strokeRectShape(
                discardPile.rect
            );
        }

        if(
            this.foundationPile &&
            this.foundationPile.pileRects
        ){
            this.foundationPile.pileRects.forEach(rect => {
                if(rect){
                    this.scene.graphics.strokeRectShape(
                        rect
                    );
                }
            });
        }
    }

    getPiles(){
        this.drawPile =
            this.scene.solitaire.drawPile;

        this.discardPile =
            this.scene.solitaire.discardPile;

        this.foundationPile =
            this.scene.solitaire.foundationPile;

        this.tableauPile =
            this.scene.solitaire.tableauPile;

        this.piles = {
            drawPile: this.drawPile,
            discardPile: this.discardPile,
            foundationPile: this.foundationPile,
            tableauPile: this.tableauPile
        };
    }

    updateLayout(){
        const isPortrait =
            this.config.height >
            this.config.width;

        if(isPortrait){
            this.layoutPortrait();
        }
        else{
            this.layoutLandscape();
        }

        this.updatePileRectGraphics();
    }

    layoutPortrait(){
        const topHeight =
            this.config.height * 0.10;

        const bottomHeight =
            this.config.height * 0.10;

        this.topSection = {
            x: 0,
            y: 0,
            width: this.config.width,
            height: topHeight
        };

        this.middleSection = {
            x: 0,
            y: topHeight,
            width: this.config.width,
            height:
                this.config.height -
                topHeight -
                bottomHeight
        };

        this.bottomSection = {
            x: 0,
            y:
                this.config.height -
                bottomHeight,
            width: this.config.width,
            height: bottomHeight
        };

        this.layoutControls(
            this.topButtons,
            this.topSection
        );

        this.layoutControls(
            this.bottomButtons,
            this.bottomSection
        );

        this.layoutPiles();
    }

    layoutLandscape(){
        const topHeight =
            this.config.height * 0.18;

        this.topSection = {
            x: 0,
            y: 0,
            width: this.config.width,
            height: topHeight
        };

        this.middleSection = {
            x: 0,
            y: topHeight,
            width: this.config.width,
            height:
                this.config.height -
                topHeight
        };

        this.layoutControls(
            this.buttons,
            this.topSection
        );

        this.layoutPiles();
    }

    layoutControls(buttons, section){
        const count =
            buttons.length;

        const gap =
            Math.min(
                10,
                section.width * 0.01
            );

        const width =
            (
                section.width -
                gap * (count - 1)
            ) / count;

        const height =
            section.height;

        for(let i = 0; i < count; ++i){
            const rect =
                new Phaser.Geom.Rectangle(
                    section.x +
                    i * (width + gap),
                    section.y,
                    width,
                    height
                );

            this.updateButton(
                buttons[i],
                rect
            );
        }
    }

    layoutPiles(){
        const section =
            this.middleSection;

        const cardMetrics =
            this.getCardMetrics(section);

        this.layoutTopPiles(
            section,
            cardMetrics
        );

        this.layoutTableauPiles(
            section,
            cardMetrics
        );
    }

    layoutTopPiles(section, cardMetrics){
        const cardWidth =
            cardMetrics.displayWidth;

        const cardHeight =
            cardMetrics.displayHeight;

        const sidePadding =
            section.width * 0.025;

        const pileGap =
            Math.max(
                6,
                section.width * 0.01
            );

        const topY =
            section.y +
            section.height * 0.05;

        const leftX =
            sidePadding;

        this.updateDrawPile(
            leftX,
            topY,
            cardWidth,
            cardHeight
        );

        this.updateDiscardPile(
            leftX +
            cardWidth +
            pileGap,
            topY,
            cardWidth,
            cardHeight
        );

        const foundationWidth =
            cardWidth * 4 +
            pileGap * 3;

        const foundationX =
            section.x +
            section.width -
            sidePadding -
            foundationWidth;

        this.updateFoundationPiles(
            foundationX,
            topY,
            cardWidth,
            cardHeight,
            pileGap
        );
    }

    layoutTableauPiles(section, cardMetrics){
        const tableauGap =
            cardMetrics.columnGap;

        const tableauWidth =
            (
                section.width -
                tableauGap * 6
            ) / 7;

        const tableauY =
            section.y +
            cardMetrics.displayHeight +
            section.height * 0.08;

        const tableauHeight =
            section.y +
            section.height -
            tableauY;

        this.updateTableauPiles(
            0,
            tableauY,
            tableauWidth,
            tableauHeight,
            tableauGap
        );
    }

    getCardMetrics(section){
        const columnGap =
            Math.max(
                4,
                section.width * 0.008
            );

        const availableWidth =
            section.width -
            columnGap * 6;

        const tableauWidth =
            availableWidth / 7;

        const displayWidth =
            Math.min(
                88,
                tableauWidth * 0.90
            );

        const displayHeight =
            displayWidth *
            (128 / 88);

        return {
            displayWidth,
            displayHeight,
            columnGap
        };
    }

    updateDrawPile(x, y, width, height){
        const pile = this.drawPile;

        if(!pile) return;

        if(pile.rect){
            pile.rect.x = x;
            pile.rect.y = y;
            pile.rect.width = width;
            pile.rect.height = height;
        }

        if(pile.container){
            pile.container.setPosition(x, y);
        }

        if(pile.zone){
            pile.zone.setPosition(x, y);
            pile.zone.setSize(width, height);
            pile.zone.input.hitArea.setTo(0, 0, width, height);
            pile.zone.setRectangleDropZone(width, height);
        }
    }

    updateDiscardPile(x, y, width, height){
        const pile = this.discardPile;

        if(!pile) return;

        if(pile.rect){
            pile.rect.x = x;
            pile.rect.y = y;
            pile.rect.width = width;
            pile.rect.height = height;
        }

        if(pile.container){
            pile.container.setPosition(x, y);
        }

        if(pile.zone){
            pile.zone.setPosition(x, y);
            pile.zone.setSize(width, height);
        }
    }

    updateFoundationPiles(x, y, width, height, gap){
        const pile = this.foundationPile;

        if(!pile) return;

        for(let i = 0; i < 4; ++i){
            const pileX =
                x +
                i * (width + gap);

            const container =
                pile.cards[i];

            const rect =
                pile.pileRects[i];

            const zone =
                pile.dropZones[i];

            if(rect){
                rect.x = pileX;
                rect.y = y;
                rect.width = width;
                rect.height = height;
            }

            if(container){
                container.setPosition(
                    pileX,
                    y
                );

                container.setSize(
                    width,
                    height
                );
            }

            if(zone){
                zone.setPosition(
                    pileX,
                    y
                );

                zone.setSize(
                    width,
                    height
                );

                zone.input.hitArea.setTo(
                    0,
                    0,
                    width,
                    height
                );

                zone.setRectangleDropZone(
                    width,
                    height
                );
            }
        }
    }

    updateTableauPiles(x, y, width, height, gap = 0){
        const pile = this.tableauPile;

        if(!pile) return;

        for(let i = 0; i < 7; ++i){
            const pileX =
                x +
                i * (width + gap);

            const container =
                pile.cards[i];

            const zone =
                pile.dropZones[i];

            if(container){
                container.setPosition(
                    pileX,
                    y
                );
            }

            if(zone){
                zone.setPosition(
                    pileX,
                    y
                );

                zone.setSize(
                    width,
                    height
                );

                zone.input.hitArea.setTo(
                    0,
                    0,
                    width,
                    height
                );

                zone.setRectangleDropZone(
                    width,
                    height
                );
            }
        }
    }

    updateButton(button, rect){
        if(!button) return;

        button.updateRect(rect);

        button.setBackgroundColor(
            0x22aa22,
            0x000000,
            1,
            4,
            1
        );
    }

    setScore(value){
        this.scoreBtn.setLabel(
            String(value)
        );
    }

    setMoves(value){
        this.movesBtn.setLabel(
            String(value)
        );
    }

    setTime(value){
        this.timeBtn.setLabel(value);
    }

    update(time, delta){}
}