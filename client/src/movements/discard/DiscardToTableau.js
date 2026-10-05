import { DiscardMovement } from "./DiscardMovement.js";

export class DiscardToTableau extends DiscardMovement {
    
    constructor(scene, card, dropZone) {
        super(scene, card, dropZone);
        this.id = "discardToTableau";
        this.originalCardData = null;
    }
    
    execute() {
        this.isValid =
            this.scene.solitaire.discardPile.isCardValidToMoveToTableau(
                this.card,
                this.dropZone
            );
        
        if (!this.isValid) {
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0, 0);
            return;
        }
        
        this.scene.audio.play(this.scene.audio.dropSound);
        
        const targetPileIndex =
            this.dropZone.getData("pileIndex");
        
        const sourcePile =
            this.scene.solitaire.discardPile.container;
        
        const targetPile =
            this.scene.solitaire.tableauPile.cards[
                targetPileIndex
            ];
        
        const targetCardIndex =
            targetPile.list.length;
        
        this.originalCardData = {
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            targetPileIndex,
            targetCardIndex
        };
        
        const newCard =
            this.scene.createCard(
                "tableauPileCard",
                0,
                targetCardIndex * 40
            )
            .setFrame(this.originalCardData.frame)
            .setInteractive({ draggable: true })
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: targetCardIndex * 40,
                pileIndex: targetPileIndex,
                cardIndex: targetCardIndex
            });
        
        targetPile.add(newCard);
        sourcePile.remove(this.card, false);
        this.card.destroy();
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
    
    undo() {
        if (!this.originalCardData) return;
        
        const sourcePile =
            this.scene.solitaire.tableauPile.cards[
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
        
        const cardIndex =
            targetPile.list.length;
        
        const newCard =
            this.scene.createCard(
                "discardPileCard",
                0,
                0
            )
            .setFrame(this.originalCardData.frame)
            .setInteractive({ draggable: true })
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: 0,
                pileIndex: 0,
                cardIndex
            });
        
        targetPile.add(newCard);
        this.card = newCard;
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
}