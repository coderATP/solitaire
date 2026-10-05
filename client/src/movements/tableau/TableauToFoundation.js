import { TableauMovement } from "./TableauMovement.js";

export class TableauToFoundation extends TableauMovement{

    constructor(scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "tableauToFoundation";
    }

    execute(){
        const cardIndex = this.card.getData("cardIndex");
        const pileIndex = this.card.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToReturn;

        this.isValid =
            this.scene.solitaire.tableauPile.isCardValidToMoveToFoundation(
                this.card,
                this.dropZone
            );

        if(!this.isValid){
            this.scene.audio.play(this.scene.audio.errorSound);

            for(let i = 0; i < numberOfCardsToMove; ++i){
                cardsToReturn = sourcePile.list[i + cardIndex];

                cardsToReturn.setPosition(
                    0,
                    cardsToReturn.getData("cardIndex") * 40
                );

                cardsToReturn.setData({
                    x: 0,
                    y: cardsToReturn.getData("cardIndex") * 40
                });
            }

            return;
        }

        this.scene.audio.play(this.scene.audio.dropSound);
        this.scene.commandHandler.movementScore += 100;

        if(cardIndex < sourcePile.length - 1) return;

        this.originalCardData = {
            originalPileIndex: pileIndex,
            originalCardIndex: cardIndex,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            wasPenultimateCardRevealed:
                sourcePile.list[sourcePile.list.length - 2] &&
                sourcePile.list[sourcePile.list.length - 2].getData("frame") > 51
        };

        const newCard =
            this.scene.createCard(
                "foundationPileCard",
                0,
                0
            )
            .setInteractive({draggable: true})
            .setFrame(this.originalCardData.frame)
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: targetPile.x,
                y: targetPile.y,
                pileIndex: targetPileIndex,
                cardIndex: targetPile.length
            });

        targetPile.add(newCard);
        this.card.destroy();

        this.scene.solitaire.tableauPile.showTopmostCardInTableau(
            sourcePile
        );

        setTimeout(() => {
            this.scene.commandHandler.checkWin();
        }, 120);

        return this;
    }

    undo(){
        if(!this.originalCardData) return;

        this.scene.commandHandler.movementScore -= 100;

        const sourcePile =
            this.scene.solitaire.foundationPile.cards[
                this.dropZone.getData("pileIndex")
            ];

        const targetPile =
            this.scene.solitaire.tableauPile.cards[
                this.originalCardData.originalPileIndex
            ];

        const movedCard =
            sourcePile.list[sourcePile.list.length - 1];

        if(movedCard) movedCard.destroy();

        if(!this.originalCardData.wasPenultimateCardRevealed){
            this.scene.solitaire.tableauPile.hideTopmostCardInTableau(
                targetPile
            );
        }

        const newCard =
            this.scene.createCard(
                "tableauPileCard",
                0,
                this.originalCardData.originalCardIndex * 40
            )
            .setInteractive({draggable: true})
            .setFrame(this.originalCardData.frame)
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: this.originalCardData.originalCardIndex * 40,
                pileIndex: this.originalCardData.originalPileIndex,
                cardIndex: this.originalCardData.originalCardIndex
            });

        targetPile.add(newCard);
        this.card = newCard;

        this.scene.commandHandler.checkWin();

        return this;
    }
}