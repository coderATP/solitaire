import { TableauMovement } from "./TableauMovement.js";

export class TableauToTableau extends TableauMovement {
    
    constructor(scene, card, dropZone) {
        super(scene, card, dropZone);
        this.id = "tableauToTableau";
        this.originalCardData = null;
        this.sourcePileIndex = null;
        this.targetPileIndex = null;
        this.numberOfCardsToMove = null;
    }
    
    execute() {
        const tableauPile = this.scene.solitaire.tableauPile;
        
        if (!this.originalCardData) {
            this.sourcePileIndex = this.card.getData("pileIndex");
            this.targetPileIndex = this.dropZone.getData("pileIndex");
            
            const sourcePile = tableauPile.cards[this.sourcePileIndex];
            const cardIndex = this.card.getData("cardIndex");
            
            this.numberOfCardsToMove =
                sourcePile.length - cardIndex;
            
            if (this.sourcePileIndex === this.targetPileIndex) {
                this.isValid = true;
                
                for (let i = 0; i < this.numberOfCardsToMove; ++i) {
                    const card =
                        sourcePile.list[cardIndex + i];
                    
                    card.setPosition(
                        0,
                        (cardIndex + i) * 40
                    );
                    
                    card.setData({
                        x: 0,
                        y: (cardIndex + i) * 40
                    });
                }
                
                return this;
            }
            
            const wasPenultimateCardRevealed =
                sourcePile.list[sourcePile.list.length - 2] &&
                sourcePile.list[
                    sourcePile.list.length - 2
                ].getData("frame") > 51;
            
            this.originalCardData = [];
            
            for (let i = 0; i < this.numberOfCardsToMove; ++i) {
                const card =
                    sourcePile.list[cardIndex + i];
                
                this.originalCardData.push({
                    originalPileIndex: this.sourcePileIndex,
                    originalCardIndex: cardIndex + i,
                    frame: card.getData("frame"),
                    value: card.getData("value"),
                    suit: card.getData("suit"),
                    colour: card.getData("colour"),
                    wasPenultimateCardRevealed
                });
            }
        }
        
        const sourcePile =
            tableauPile.cards[this.sourcePileIndex];
        
        const targetPile =
            tableauPile.cards[this.targetPileIndex];
        
        const cardIndex =
            this.originalCardData[0].originalCardIndex;
        
        const currentCard =
            sourcePile.list[cardIndex];
        
        if (!currentCard) {
            this.isValid = false;
            return;
        }
        
        const hasHiddenCard =
            this.originalCardData.some(cardData =>
                cardData.frame >= 52
            );
        
        this.isValid =
            !hasHiddenCard &&
            tableauPile.isCardValidToMoveToTableau(
                currentCard,
                this.dropZone
            );
        
        if (!this.isValid) {
            this.scene.audio.play(
                this.scene.audio.errorSound
            );
            
            for (
                let i = 0;
                i < this.numberOfCardsToMove;
                ++i
            ) {
                const card =
                    sourcePile.list[cardIndex + i];
                
                if (card) {
                    card.setPosition(
                        0,
                        (cardIndex + i) * 40
                    );
                    
                    card.setData({
                        x: 0,
                        y: (cardIndex + i) * 40
                    });
                }
            }
            
            return;
        }
        
        this.scene.audio.play(
            this.scene.audio.dropSound
        );
        
        const sourceCards = [];
        
        for (
            let i = 0;
            i < this.numberOfCardsToMove;
            ++i
        ) {
            const card =
                sourcePile.list[cardIndex + i];
            
            if (card) {
                sourceCards.push(card);
            }
        }
        
        for (let i = 0; i < sourceCards.length; ++i) {
            const sourceCard = sourceCards[i];
            const targetCardIndex = targetPile.length;
            
            const newCard =
                this.scene.createCard(
                    "tableauPileCard",
                    0,
                    targetCardIndex * 40
                )
                .setInteractive({
                    draggable: true
                })
                .setFrame(
                    sourceCard.getData("frame")
                )
                .setData({
                    x: 0,
                    y: targetCardIndex * 40,
                    frame: sourceCard.getData("frame"),
                    value: sourceCard.getData("value"),
                    suit: sourceCard.getData("suit"),
                    colour: sourceCard.getData("colour"),
                    pileIndex: this.targetPileIndex,
                    cardIndex: targetCardIndex
                });
            
            targetPile.add(newCard);
            sourceCard.destroy();
            
            if (i === sourceCards.length - 1) {
                this.card = newCard;
            }
        }
        
        tableauPile.showTopmostCardInTableau(
            sourcePile
        );
        
        setTimeout(() => {
            this.scene.commandHandler.checkWin();
        }, 120);
        
        return this;
    }
    
    undo() {
        if (
            !this.originalCardData ||
            !this.originalCardData[0]
        ) {
            return;
        }
        
        const tableauPile =
            this.scene.solitaire.tableauPile;
        
        const sourcePile =
            tableauPile.cards[this.targetPileIndex];
        
        const targetPile =
            tableauPile.cards[this.sourcePileIndex];
        
        for (
            let i = 0;
            i < this.numberOfCardsToMove;
            ++i
        ) {
            const cardToRemove =
                sourcePile.list[
                    sourcePile.list.length - 1
                ];
            
            if (cardToRemove) {
                cardToRemove.destroy();
            }
        }
        
        if (
            !this.originalCardData[0]
                .wasPenultimateCardRevealed
        ) {
            tableauPile.hideTopmostCardInTableau(
                targetPile
            );
        }
        
        for (
            let i = 0;
            i < this.numberOfCardsToMove;
            ++i
        ) {
            const cardData =
                this.originalCardData[i];
            
            const cardGameObject =
                this.scene.createCard(
                    "tableauPileCard",
                    0,
                    cardData.originalCardIndex * 40
                )
                .setInteractive({
                    draggable: true
                })
                .setFrame(cardData.frame)
                .setData({
                    x: 0,
                    y: cardData.originalCardIndex * 40,
                    frame: cardData.frame,
                    value: cardData.value,
                    suit: cardData.suit,
                    colour: cardData.colour,
                    pileIndex: cardData.originalPileIndex,
                    cardIndex: cardData.originalCardIndex
                });
            
            targetPile.add(cardGameObject);
            
            if (
                i ===
                this.numberOfCardsToMove - 1
            ) {
                this.card = cardGameObject;
            }
        }
        
        tableauPile.showTopmostCardInTableau(
            targetPile
        );
        
        this.scene.commandHandler.checkWin();
        
        return this;
    }
}