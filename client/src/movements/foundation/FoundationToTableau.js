import { FoundationMovement } from "./FoundationMovement.js";

export class FoundationToTableau extends FoundationMovement {
    
    constructor(scene, card, dropZone) {
        super(scene, card, dropZone);
        this.id = "foundationToTableau";
    }
    
    execute() {
        this.isValid =
            this.scene.solitaire.foundationPile.isCardValidToMoveToTableau(
                this.card,
                this.dropZone
            );
        
        if (!this.isValid) {
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0, 0);
            return;
        }
        
        this.scene.audio.play(this.scene.audio.dropSound);
        
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const sourcePile =
            this.scene.solitaire.foundationPile.cards[pileIndex];
        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];
        const targetCardIndex = targetPile.list.length;
        
        this.originalCardData = {
            originalCardIndex: this.card.getData("cardIndex"),
            originalPileIndex: pileIndex,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour")
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
        this.card.destroy();
        
        return this;
    }
    
    undo() {
        if (!this.originalCardData) return;
        
        const sourcePile =
            this.scene.solitaire.tableauPile.cards[
                this.dropZone.getData("pileIndex")
            ];
        
        const targetPile =
            this.scene.solitaire.foundationPile.cards[
                this.originalCardData.originalPileIndex
            ];
        
        const movedCard =
            sourcePile.list[sourcePile.list.length - 1];
        
        if (movedCard) movedCard.destroy();
        
        const cardIndex = targetPile.list.length;
        
        const newCard =
            this.scene.createCard(
                "foundationPileCard",
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
                pileIndex: this.originalCardData.originalPileIndex,
                cardIndex
            });
        
        targetPile.add(newCard);
        this.card = newCard;
        
        return this;
    }
}