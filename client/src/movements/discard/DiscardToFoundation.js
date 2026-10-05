import { DiscardMovement } from "./DiscardMovement.js";

export class DiscardToFoundation extends DiscardMovement {
    
    constructor(scene, card, dropZone) {
        super(scene, card, dropZone);
        this.id = "discardToFoundation";
        this.originalCardData = null;
    }
    
    execute() {
        const targetPileIndex =
            this.dropZone.getData("pileIndex");
        
        const sourcePile =
            this.scene.solitaire.discardPile.container;
        
        const targetPile =
            this.scene.solitaire.foundationPile.cards[
                targetPileIndex
            ];
        
        this.isValid =
            this.scene.solitaire.discardPile
            .isCardValidToMoveToFoundation(
                this.card,
                this.dropZone
            );
        
        if (!this.isValid) {
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0, 0);
            return;
        }
        
        this.scene.commandHandler.movementScore += 100;
        this.scene.audio.play(this.scene.audio.dropSound);
        
        this.originalCardData = {
            targetPileIndex,
            cardIndex: targetPile.length,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour")
        };
        
        const newCard =
            this.scene.createCard(
                "foundationPileCard",
                0,
                0
            )
            .setInteractive({ draggable: true })
            .setFrame(this.originalCardData.frame)
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: 0,
                pileIndex: targetPileIndex,
                cardIndex: this.originalCardData.cardIndex
            });
        
        targetPile.add(newCard);
        sourcePile.remove(this.card, false);
        this.card.destroy();
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
    
    undo() {
        if (!this.originalCardData) return;
        
        this.scene.commandHandler.movementScore -= 100;
        
        const sourcePile =
            this.scene.solitaire.foundationPile.cards[
                this.originalCardData.targetPileIndex
            ];
        
        const targetPile =
            this.scene.solitaire.discardPile.container;
        
        const movedCard =
            sourcePile.list[sourcePile.list.length - 1];
        
        if (movedCard) {
            sourcePile.remove(movedCard, false);
            movedCard.destroy();
        }
        
        const newCard =
            this.scene.createCard(
                "discardPileCard",
                0,
                0
            )
            .setInteractive({ draggable: true })
            .setFrame(this.originalCardData.frame)
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: 0,
                cardIndex: targetPile.list.length
            });
        
        targetPile.add(newCard);
        this.card = newCard;
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
}