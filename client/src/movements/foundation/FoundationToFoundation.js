import { FoundationMovement } from "./FoundationMovement.js";

export class FoundationToFoundation extends FoundationMovement {
    
    constructor(scene, card, dropZone) {
        super(scene, card, dropZone);
        this.id = "foundationToFoundation";
        this.originalCardData = null;
        this.sourcePileIndex = null;
        this.targetPileIndex = null;
    }
    
    execute() {
        const foundationPile = this.scene.solitaire.foundationPile;
        
        this.sourcePileIndex = this.card.getData("pileIndex");
        this.targetPileIndex = this.dropZone.getData("pileIndex");
        
        this.originalCardData = {
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            originalCardIndex: this.card.getData("cardIndex")
        };
        
        this.isValid =
            foundationPile.isCardValidToMoveToFoundation(
                this.card,
                this.dropZone
            );
        
        if (!this.isValid) {
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0, 0);
            return;
        }
        
        if (this.sourcePileIndex === this.targetPileIndex) {
            this.isValid = false;
            this.card.setPosition(0, 0);
            return;
        }
        
        this.scene.audio.play(this.scene.audio.dropSound);
        
        const targetPile =
            foundationPile.cards[this.targetPileIndex];
        
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
                pileIndex: this.targetPileIndex,
                cardIndex: targetPile.list.length
            });
        
        targetPile.add(newCard);
        this.card.destroy();
        this.card = newCard;
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
    
    undo() {
        if (!this.originalCardData) return;
        
        const foundationPile = this.scene.solitaire.foundationPile;
        
        const sourcePile =
            foundationPile.cards[this.targetPileIndex];
        
        const targetPile =
            foundationPile.cards[this.sourcePileIndex];
        
        const movedCard =
            sourcePile.list[sourcePile.list.length - 1];
        
        if (movedCard) movedCard.destroy();
        
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
                pileIndex: this.sourcePileIndex,
                cardIndex: this.originalCardData.originalCardIndex
            });
        
        targetPile.add(newCard);
        this.card = newCard;
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
}