import { BaseScene } from "./BaseScene.js";

import { GameplayUI } from "../ui/GameplayUI.js";

//audio
import { AudioControl } from "../audio/AudioControl.js";
import { CommandHandler } from "../CommandHandler.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Time } from "../events/Time.js";

//card movements
import { DrawToDiscard } from "../movements/draw/DrawToDiscard.js";
import { DiscardToDraw } from "../movements/discard/DiscardToDraw.js";
import { DiscardToFoundation } from "../movements/discard/DiscardToFoundation.js";
import { DiscardToTableau } from "../movements/discard/DiscardToTableau.js";
import { FoundationToFoundation } from "../movements/foundation/FoundationToFoundation.js";
import { FoundationToTableau } from "../movements/foundation/FoundationToTableau.js";
import { TableauToFoundation } from "../movements/tableau/TableauToFoundation.js";
import { TableauToTableau } from "../movements/tableau/TableauToTableau.js";

import { Solitaire } from "../Solitaire.js";


export class PlayScene extends BaseScene{

    constructor(config) {
    
        super("PlayScene", config);
        
        this.config = config;
        
        this.ui = null;
        
        this.commandHandler =
            new CommandHandler(this);
        
        this.handleOrientationChange = this.handleOrientationChange.bind(this);
        this.handleResume = this.handleResume.bind(this);
    }


    setGameSize(){

        const w =
            window.innerWidth * 2;

        const h =
            window.innerHeight * 2;

        this.config.width = w;
        this.config.height = h;

        this.scale.setGameSize(
            w,
            h
        );
    }


    handleOrientationChange(){

        this.setGameSize();

        if(this.ui){

            this.time.delayedCall(
                0,
                () => {

                    this.ui.updateLayout();

                }
            );
        }
    }
    
    handleResume() {
    if (this.watch) {
        this.watch.resumeWatch();
    }
}


    getCardMetrics(){

        const gameWidth =
            this.scale.gameSize.width;

        const margin = 10;
        const gap = 5;

        const availableWidth =
            gameWidth -
            (margin * 2) -
            (gap * 6);

        const displayWidth =
            Math.min(
                88 * this.config.zoomFactor,
                availableWidth / 7
            );

        const displayHeight =
            displayWidth * (128 / 88);

        return {
            displayWidth,
            displayHeight,
            margin,
            gap
        };
    }


    createCard(type, x, y){

        const card =
            this.add.image(
                x,
                y,
                "cards"
            )
            .setName(type)
            .setOrigin(0)
            .setScale(
                this.config.zoomFactor
            );

        return card;
    }


    createPileRect(x, y, w, h){

    return new Phaser.Geom.Rectangle(
        x,
        y,
        w,
        h
    );
} 


    createDropZone(
        zoneType,
        x,
        y,
        w,
        h
    ){

        const zone =
    this.add.zone(
        x,
        y,
        w,
        h
    )
    .setRectangleDropZone(
        w + 30,
        h + 30
    )
    .setInteractive()
    .setDepth(-2)
    .setName(zoneType)
    .setOrigin(0);


        if(this.config.debug){

            this.add.rectangle(
                x,
                y,
                w,
                h,
                0x09144ff,
                0.0
            )
            .setDepth(200)
            .setOrigin(0);
        }

        return zone;
    }


    handleDragEvent(){

        this.input.on(
            "drag",
            (
                pointer,
                gameobject,
                dragX,
                dragY
            ) => {

                gameobject.setPosition(
                    dragX,
                    dragY
                );


                if(
                    gameobject.name ===
                    "tableauPileCard"
                ){

                    const pileIndex =
                        gameobject.getData(
                            "pileIndex"
                        );

                    const cardIndex =
                        gameobject.getData(
                            "cardIndex"
                        );

                    const pile =
                        this.solitaire
                            .tableauPile
                            .cards[pileIndex];

                    pile.setDepth(10);


                    if(
                        cardIndex <
                        pile.length - 1
                    ){

                        for(
                            let i = 0;
                            i <
                            pile.length -
                            cardIndex;
                            ++i
                        ){

                            const card =
                                pile.list[
                                    i + cardIndex
                                ];

                            card
                                .setPosition(
                                    dragX,
                                    dragY +
                                    i * 20
                                )
                                .setDepth(10)
                                .setAlpha(0.7);
                        }
                    }
                }

                else if(
                    gameobject.name ===
                    "foundationPileCard"
                ){

                    const pile =
                        this.solitaire
                            .foundationPile
                            .cards[
                                gameobject.getData(
                                    "pileIndex"
                                )
                            ];

                    pile &&
                        pile.setDepth(10);

                    gameobject.setAlpha(
                        0.7
                    );
                }

                else if(
                    gameobject.name ===
                    "discardPileCard"
                ){

                    gameobject
                        .setDepth(10)
                        .setAlpha(0.7);
                }
            }
        );


        this.input.on(
            "dragend",
            (
                pointer,
                gameobject,
                dropped
            ) => {

                gameobject
                    .setDepth(0)
                    .setAlpha(1);


                if(
                    gameobject.name ===
                    "foundationPileCard"
                ){

                    if(!dropped){

                        this.solitaire
                            .foundationPile
                            .handleMoveCardToEmptySpace(
                                gameobject
                            );

                        return;
                    }
                }

                else if(
                    gameobject.name ===
                    "discardPileCard"
                ){

                    if(!dropped){

                        this.solitaire
                            .discardPile
                            .handleMoveCardToEmptySpace(
                                gameobject
                            );

                        return;
                    }
                }

                else if(
                    gameobject.name ===
                    "tableauPileCard"
                ){

                    if(!dropped){

                        this.solitaire
                            .tableauPile
                            .handleMoveCardToEmptySpace(
                                gameobject
                            );

                        return;
                    }


                    const pileIndex =
                        gameobject.getData(
                            "pileIndex"
                        );

                    const cardIndex =
                        gameobject.getData(
                            "cardIndex"
                        );

                    const pile =
                        this.solitaire
                            .tableauPile
                            .cards[pileIndex];

                    pile
                        .setDepth(0)
                        .setAlpha(1);

                    gameobject
                        .setDepth(0)
                        .setAlpha(1);


                    if(
                        cardIndex <
                        pile.length - 1
                    ){

                        for(
                            let i = 0;
                            i <
                            pile.length -
                            cardIndex;
                            ++i
                        ){

                            const card =
                                pile.list[
                                    i + cardIndex
                                ];

                            card
                                .setPosition(
                                    card.getData("x"),
                                    card.getData("y")
                                )
                                .setDepth(0)
                                .setAlpha(1);
                        }
                    }
                }
            }
        );

        return this;
    }


    handleDropEvent(){

        this.input.on(
            "drop",
            (
                pointer,
                gameobject,
                dropZone
            ) => {

                gameobject
                    .setDepth(0)
                    .setAlpha(1);


                switch(dropZone.name){

                    case "foundationPileZone":{

                        if(
                            gameobject.name ===
                            "discardPileCard"
                        ){

                            const command =
                                new DiscardToFoundation(
                                    this,
                                    gameobject,
                                    dropZone
                                );

                            this.commandHandler
                                .execute(command);
                        }

                        else if(
                            gameobject.name ===
                            "tableauPileCard"
                        ){

                            const command =
                                new TableauToFoundation(
                                    this,
                                    gameobject,
                                    dropZone
                                );

                            this.commandHandler
                                .execute(command);
                        }

                        else if(
                            gameobject.name ===
                            "foundationPileCard"
                        ){

                            const command =
                                new FoundationToFoundation(
                                    this,
                                    gameobject,
                                    dropZone
                                );

                            this.commandHandler
                                .execute(command);
                        }

                        break;
                    }


                    case "tableauPileZone":{

                        if(
                            gameobject.name ===
                            "discardPileCard"
                        ){

                            const command =
                                new DiscardToTableau(
                                    this,
                                    gameobject,
                                    dropZone
                                );

                            this.commandHandler
                                .execute(command);
                        }

                        else if(
                            gameobject.name ===
                            "tableauPileCard"
                        ){

                            const command =
                                new TableauToTableau(
                                    this,
                                    gameobject,
                                    dropZone
                                );

                            this.commandHandler
                                .execute(command);
                        }

                        else if(
                            gameobject.name ===
                            "foundationPileCard"
                        ){

                            const command =
                                new FoundationToTableau(
                                    this,
                                    gameobject,
                                    dropZone
                                );

                            this.commandHandler
                                .execute(command);
                        }

                        break;
                    }


                    case "discardPileZone":{

                        if(
                            gameobject.name ===
                            "tableauPileCard"
                        ){

                            this.solitaire
                                .tableauPile
                                .handleMoveCardToDiscard(
                                    gameobject,
                                    dropZone
                                );
                        }

                        else if(
                            gameobject.name ===
                            "foundationPileCard"
                        ){

                            this.solitaire
                                .foundationPile
                                .handleMoveCardToDiscard(
                                    gameobject
                                );
                        }

                        else if(
                            gameobject.name ===
                            "discardPileCard"
                        ){

                            this.solitaire
                                .discardPile
                                .handleMoveCardToDiscard(
                                    gameobject
                                );
                        }

                        break;
                    }


                    case "drawPileZone":{

                        if(
                            gameobject.name ===
                            "tableauPileCard"
                        ){

                            this.solitaire
                                .tableauPile
                                .handleMoveCardToDraw(
                                    gameobject,
                                    dropZone
                                );
                        }

                        else if(
                            gameobject.name ===
                            "foundationPileCard"
                        ){

                            this.solitaire
                                .foundationPile
                                .handleMoveCardToDraw(
                                    gameobject
                                );
                        }

                        else if(
                            gameobject.name ===
                            "discardPileCard"
                        ){

                            this.solitaire
                                .discardPile
                                .handleMoveCardToDraw(
                                    gameobject
                                );
                        }

                        break;
                    }
                }
            }
        );

        return this;
    }


    handleClickEvent(){
        
        this.input.on(
            "pointerdown",
            (
                pointer,
                gameobject
            ) => {

                if(!gameobject[0]){
                    return;
                }


                if(
                    gameobject[0].name ===
                    "drawPileCard"
                ){

                    this.audio.play(
                        this.audio.drawSound
                    );

                    const command =
                        new DrawToDiscard(
                            this,
                            gameobject[0],
                            null
                        );

                    this.commandHandler
                        .execute(command);
                }

                else if(
                    gameobject[0].name ===
                    "drawPileZone"
                ){

                    const command =
                        new DiscardToDraw(
                            this,
                            null,
                            null
                        );

                    this.commandHandler
                        .execute(command);
                }
            }
        );


        this.ui.undoBtn.hitArea.on(
            "pointerdown",
            () => {

                if(
                    this.commandHandler
                        .moves.length > 0
                ){

                    this.audio.play(
                        this.audio.undoSound
                    );

                    this.commandHandler.undo();
                }
                else{

                    this.audio.play(
                        this.audio.errorSound
                    );
                }
            }
        );

        this.ui.pauseBtn.hitArea.on(
            "pointerdown",
            () => {

                eventEmitter.emit(
                    "PlayToPause"
                );
            }
        );


        return this;
    }


    processEvents(){

        const {
            GameCompleteScene,
            PauseScene
        } = this.game.scene.keys;


        eventEmitter.on(
            "PlayToPause",
            () => {

                if(
                    !this.scene.isPaused(
                        "PlayScene"
                    )
                ){
                    this.watch.stopWatch();
                    if(!PauseScene.gamePaused){
                        this.scene.pause();
                    }

                    this.audio.popUpSound.play();

                    this.scene.launch(
                        "PauseScene"
                    );

                    PauseScene.gamePaused =
                        true;
                }
            }
        );


        eventEmitter.on(
            "PlayToGameComplete",
            () => {
                this.watch.stopWatch();
                if(
                    !this.scene.isPaused(
                        "PlayScene"
                    )
                ){

                    this.scene.pause();
                }

                this.scene.launch(
                    "GameCompleteScene"
                );

                this.audio.popUpSound.play();

                //this.audio.playSong.stop();

                GameCompleteScene.gamePaused =
                    true;
            }
        );


        eventEmitter.once(
            "PlayToTitle",
            () => {

                this.scene.start(
                    "TitleScene"
                );
            }
        );
    }


    updateMoves(){

        this.ui.setMoves(
            this.commandHandler.totalMovesCount
        );
    }


    updateScore(){

        this.ui.setScore(
            this.commandHandler.movementScore
        );
    }


    create(){

        this.camera =
            this.cameras.main;

        this.camera.fadeIn(2000);


        this.audio =
            new AudioControl(this);


        this.watch =
            new Time(this);


        this.graphics =
            this.add.graphics({
                lineStyle: {
                    width: 1,
                    color: "0xffffff"
                }
            });

        this.solitaire = new Solitaire(this);
        this.ui = new GameplayUI(this);
        this.solitaire.newGame();
        this.watch.setUpWatch();

        this.handleDragEvent()
            .handleDropEvent()
            .handleClickEvent();

        this.processEvents();
        this.events.on("resume", this.handleResume);

        window.addEventListener("resize", this.handleOrientationChange);
    }


    shutdown() {
    
    if (this.watch) {
        this.watch.stopWatch();
    }
    
    this.events.off(
        "resume",
        this.handleResume
    );
    
    window.removeEventListener(
        "resize",
        this.handleOrientationChange
    );
}


    update(time, delta){

        this.updateMoves();

        this.updateScore();

        this.solitaire.update(
            time,
            delta
        );
    }
}