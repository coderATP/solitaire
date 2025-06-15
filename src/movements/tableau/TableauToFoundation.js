import { TableauMovement } from "./TableauMovement.js";

export class TableauToFoundation extends TableauMovement{
    constructor (scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "tableauToFoundation"
    }
    
    execute(){
        const cardIndex = this.card.getData("cardIndex");
        const pileIndex = this.card.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
  
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToReturn;
        const isValid = this.scene.solitaire.tableauPile.isCardValidToMoveToFoundation(this.card, this.dropZone);
        if(!isValid){
            for(let i = 0; i < numberOfCardsToMove; ++i){
                cardsToReturn = sourcePile.list[i+cardIndex];
                cardsToReturn.setPosition(0, cardsToReturn.getData("cardIndex")*20 );
                cardsToReturn.setData({x: 0, y: cardsToReturn.getData("cardIndex")*20} );
            }
            return;
        }
        //TO-DO: move a valid card to foundation
        //only one card can be moved at a time from the tableau to foundation
        if(cardIndex < sourcePile.length-1 ){
           //throw new Error("moving multiple cards is invalid")
            return;
        }
        
        const newCard = this.scene.createCard("foundationPileCard", 0, 0)
        newCard
        .setInteractive({draggable: true})
        .setFrame(this.card.getData("frame"));
         
        newCard.setData({
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            x: targetPile.x,
            y: targetPile.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })

        this.originalCardData = {
            x: targetPile.x,
            y: targetPile.y,
            originalX: this.card.x,
            originalY: this.card.y,
            originalPileIndex: pileIndex,
            currentPileIndex: targetPileIndex,
            originalCardIndex: sourcePile.length-1,
            currentCardIndex: targetPile.length,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            wasPenultimateCardRevealed: sourcePile.list[sourcePile.list.length-2]&& sourcePile.list[sourcePile.list.length-2].getData("frame") > 51 
        }
        targetPile.add(newCard);
        this.card.destroy();
        //sourcePile.list.pop(); //card.destroy() also works
        this.scene.solitaire.tableauPile.showTopmostCardInTableau(sourcePile);
 
        return this; 
    }
    
    undo(command){
        const sourcePile = this.scene.solitaire.foundationPile.cards[command.originalCardData.currentPileIndex];
        const targetPile = this.scene.solitaire.tableauPile.cards[command.originalCardData.originalPileIndex];

        const newCard = this.scene.createCard("tableauPileCard", 0, 0)
        newCard
        .setInteractive({draggable: true})
        .setFrame(command.originalCardData.frame)
        .setPosition(0, targetPile.length*20);
        
        newCard.setData({
            frame: command.originalCardData.frame,
            value: command.originalCardData.value,
            suit: command.originalCardData.suit,
            colour: command.originalCardData.colour,
            x: targetPile.x,
            y: targetPile.y,
            pileIndex: command.originalCardData.originalPileIndex,
            cardIndex: targetPile.length
        })
        
        //hide card above again
        this.scene.solitaire.tableauPile.hideTopmostCardInTableau(targetPile);
        targetPile.add(newCard);
        sourcePile.list.pop(); //card.destroy() also works
  
        return this;
    }
}