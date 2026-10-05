import { DrawMovement } from "./DrawMovement.js";

export class DrawToDiscard extends DrawMovement {
    
    constructor(scene, card, dropZone) {
        super(scene, card, dropZone);
        this.id = "drawToDiscard";
        this.originalCardData = null;
    }
    
    execute() {
        const drawPile =
            this.scene.solitaire.drawPile.container;
        
        const discardPile =
            this.scene.solitaire.discardPile.container;
        
        if (drawPile.list.length === 0 || !this.card) {
            this.isValid = false;
            return;
        }
        
        this.originalCardData = {
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour")
        };
        
        this.isValid = true;
        
        const newCard =
            this.scene.createCard(
                "discardPileCard",
                0,
                0
            )
            .setInteractive({ draggable: true })
            .setFrame(this.originalCardData.frame)
            .setDepth(5)
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: 0,
                cardIndex: discardPile.list.length
            });
        
        discardPile.add(newCard);
        
        const sourceCard =
            drawPile.list[drawPile.list.length - 1];
        
        if (sourceCard) {
            drawPile.remove(sourceCard, false);
            sourceCard.destroy();
        }
        
        this.scene.solitaire.drawPile
            .updateTopmostTwoCardsPosition();
        
        return this;
    }
    
    undo() {
        if (!this.originalCardData) return;
        
        const drawPile =
            this.scene.solitaire.drawPile.container;
        
        const discardPile =
            this.scene.solitaire.discardPile.container;
        
        const discardCard =
            discardPile.list[discardPile.list.length - 1];
        
        if (!discardCard) return this;
        
        discardPile.remove(discardCard, false);
        discardCard.destroy();
        
        const newCard =
            this.scene.createCard(
                "drawPileCard",
                0,
                0
            )
            .setInteractive({ draggable: false })
            .setFrame(52)
            .setDepth(5)
            .setData({
                frame: this.originalCardData.frame,
                value: this.originalCardData.value,
                suit: this.originalCardData.suit,
                colour: this.originalCardData.colour,
                x: 0,
                y: 0
            });
        
        newCard.setPosition(0, 0);
        drawPile.add(newCard);
        
        this.scene.solitaire.drawPile
            .updateTopmostTwoCardsPosition();
        
        return this;
    }
}