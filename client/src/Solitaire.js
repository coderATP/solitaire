import { DrawPile } from "./piles/DrawPile.js";
import { DiscardPile } from "./piles/DiscardPile.js";
import { FoundationPile } from "./piles/FoundationPile.js";
import { TableauPile } from "./piles/TableauPile.js";

import { AudioControl } from "./audio/AudioControl.js";


export class Solitaire{

    static CARD_BACK_FRAMES = [
        52,
        53,
        54,
        55,
        56
    ];

    static CARD_VALUES = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
    ];

    static CARD_START_FRAMES = {
        CLUB: 0,
        DIAMOND: 13,
        HEART: 26,
        SPADE: 39
    };

    static CARD_COLOURS = {
        CLUB: "BLACK",
        DIAMOND: "RED",
        HEART: "RED",
        SPADE: "BLACK"
    };

    static CARD_SUITS = [
        "CLUB",
        "DIAMOND",
        "HEART",
        "SPADE"
    ];


    constructor(scene){

        this.scene = scene;

        this.drawPile =
            new DrawPile(scene).create();

        this.discardPile =
            new DiscardPile(scene).create();

        this.foundationPile =
            new FoundationPile(scene).create();

        this.tableauPile =
            new TableauPile(scene).create();

        this.deck = [];
    }


    createDeck(){

        for(let i = 0; i < Solitaire.CARD_SUITS.length; ++i){

            const startFrame =
                Object.values(
                    Solitaire.CARD_START_FRAMES
                )[i];


            for(let j = 0; j < 13; ++j){

                const card =
                    this.scene.createCard(
                        "null",
                        -100,
                        -100
                    )
                    .setOrigin(0)
                    .setFrame(52)
                    .setDepth(9)
                    .setData({
                        frame: startFrame + j,
                        value: j + 1,
                        suit: Solitaire.CARD_SUITS[i],
                        colour: Object.values(
                            Solitaire.CARD_COLOURS
                        )[i]
                    });


                this.deck.push(card);
            }
        }
    }


    shuffleDeck(){

        let tempDeck = [];


        while(this.deck.length){

            const randomPos =
                Math.floor(
                    Math.random() *
                    this.deck.length
                );


            const randomCard =
                this.deck.splice(
                    randomPos,
                    1
                )[0];


            tempDeck.push(
                randomCard
            );
        }


        this.deck =
            tempDeck;

        tempDeck = [];


        return this.deck;
    }


    distributeDeckCardsToPiles(){

        let tempDeck =
            this.deck;


        const drawPileCards =
            tempDeck.splice(
                0,
                24
            );


        this.drawPile.container =
            this.scene.add.container(
                this.drawPile.rect.x,
                this.drawPile.rect.y
            );


        for(let i = 0; i < 24; ++i){

            const tempCard =
                drawPileCards[i];


            const card =
                this.scene.createCard(
                    "drawPileCard",
                    0,
                    0
                )
                .setDepth(0)
                .setFrame(52)
                .setInteractive({
                    draggable: false
                });


            card.setData({
                frame: tempCard.getData("frame"),
                colour: tempCard.getData("colour"),
                value: tempCard.getData("value"),
                suit: tempCard.getData("suit")
            });


            card.setData({
                x: card.x,
                y: card.y
            });


            this.drawPile.container.add(
                card
            );


            drawPileCards[i].destroy();
        }


        this.drawPile.cards.push(
            this.drawPile.container
        );


        for(let i = 0; i < 7; ++i){

            const container =
                this.scene.add.container(
                    0,
                    0
                );


            for(let j = 0; j < i + 1; ++j){

                container.add(
                    tempDeck.splice(
                        0,
                        1
                    )[0]
                );
            }


            this.tableauPile.cards.push(
                container
            );
        }


        tempDeck.forEach(card => {

            this.tableauPile.cards[6].add(
                card
            );
        });


        this.tableauPile.cards.forEach(
            (container, i) => {

                container.list.forEach(
                    (card, j) => {

                        card
                            .setPosition(
                                0,
                                j * 40
                            )
                            .setDepth(2)
                            .setFrame(52)
                            .setInteractive({
                                draggable: true
                            })
                            .setName(
                                "tableauPileCard"
                            );


                        card.setData({
                            frame: card.getData("frame"),
                            colour: card.getData("colour"),
                            value: card.getData("value"),
                            suit: card.getData("suit"),
                            x: card.x,
                            y: card.y,
                            pileIndex: i,
                            cardIndex: j
                        });
                    }
                );


                this.tableauPile
                    .showTopmostCardInTableau(
                        container
                    );
            }
        );


        tempDeck = [];

this.deck = [];

if (this.scene.ui) {
    this.scene.ui.updateLayout();
}
    }


    newGame(){

        this.scene.commandHandler.reset();

        this.scene.updateMoves();

        this.scene.updateScore();

        this.createDeck();

        this.deck =
            this.shuffleDeck();


        this.scene.audio.shuffleSound.play();


        this.scene.audio.shuffleSound.once(
            "complete",
            () => {

                this.distributeDeckCardsToPiles();
            }
        );
    }


    displayEndOfGameStatistics(){

        const time =
            this.scene.watch.getRemainingTime();

        const timeScore =
            time * 5;

        const moves =
            this.scene.commandHandler.getTotalMoves();

        const totalNumberOfCards =
            52;

        const movesScore =
            totalNumberOfCards * 100;


        this.scene.ui.levelCompleteTotalMovesText.innerText =
            "Total moves: " + moves;

        this.scene.ui.levelCompleteTimeBonusText.innerText =
            "Time bonus: " +
            timeScore +
            " pts";

        this.scene.ui.levelCompleteTotalScoreText.innerText =
            "Total: " +
            (timeScore + movesScore) +
            " pts";
    }


    onClickRestartButton(){

        while(
            this.scene.commandHandler.moves.length
        ){

            this.scene.commandHandler.undo();
        }
    }


    update(time, delta){

    }
}