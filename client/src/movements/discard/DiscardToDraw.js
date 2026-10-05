import { DiscardMovement } from "./DiscardMovement.js";

export class DiscardToDraw extends DiscardMovement{

    constructor(scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "discardToDraw";
        this.originalCards = [];
    }

    execute(){
        const drawPile =
            this.scene.solitaire.drawPile.container;

        const discardPile =
            this.scene.solitaire.discardPile.container;

        if(
            drawPile.list.length > 0 ||
            discardPile.list.length === 0
        ){
            this.isValid = false;
            return;
        }

        this.isValid = true;

        this.originalCards =
            discardPile.list.map(card => ({
                frame: card.getData("frame"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                colour: card.getData("colour")
            }));

        while(discardPile.list.length > 0){
            const card =
                discardPile.list[discardPile.list.length - 1];

            discardPile.remove(card, false);
            card.destroy();
        }

        const recycledCards =
            [...this.originalCards].reverse();

        recycledCards.forEach(data => {
            const newCard =
                this.scene.createCard(
                    "drawPileCard",
                    0,
                    0
                )
                .setInteractive({draggable: false})
                .setFrame(52)
                .setDepth(5)
                .setData({
                    frame: data.frame,
                    value: data.value,
                    suit: data.suit,
                    colour: data.colour,
                    x: 0,
                    y: 0
                });

            drawPile.add(newCard);
        });

        this.scene.solitaire.drawPile
            .updateTopmostTwoCardsPosition();

        return this;
    }

    undo(){
        if(this.originalCards.length === 0) return;

        const drawPile =
            this.scene.solitaire.drawPile.container;

        const discardPile =
            this.scene.solitaire.discardPile.container;

        while(drawPile.list.length > 0){
            const card =
                drawPile.list[drawPile.list.length - 1];

            drawPile.remove(card, false);
            card.destroy();
        }

        this.originalCards.forEach(data => {
            const newCard =
                this.scene.createCard(
                    "discardPileCard",
                    0,
                    0
                )
                .setInteractive({draggable: true})
                .setFrame(data.frame)
                .setDepth(5)
                .setData({
                    frame: data.frame,
                    value: data.value,
                    suit: data.suit,
                    colour: data.colour,
                    x: 0,
                    y: 0,
                    cardIndex: discardPile.list.length
                });

            discardPile.add(newCard);
        });

        return this;
    }
}