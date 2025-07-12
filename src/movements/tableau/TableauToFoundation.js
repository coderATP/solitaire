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
        this.isValid = this.scene.solitaire.tableauPile.isCardValidToMoveToFoundation(this.card, this.dropZone);
        if(!this.isValid){
            this.scene.audio.play(this.scene.audio.errorSound);
            for(let i = 0; i < numberOfCardsToMove; ++i){
                cardsToReturn = sourcePile.list[i+cardIndex];
                cardsToReturn.setPosition(0, cardsToReturn.getData("cardIndex")*20 );
                cardsToReturn.setData({x: 0, y: cardsToReturn.getData("cardIndex")*20} );
            }
            return;
        }
        //play audio
        this.scene.audio.play(this.scene.audio.dropSound);
        //increase score
        this.scene.commandHandler.movementScore+=100;
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
        sourcePile.list.pop();
        this.scene.solitaire.tableauPile.showTopmostCardInTableau(sourcePile);
        setTimeout(()=>{ this.scene.commandHandler.checkWin(); }, 120);
        return this; 
    }
    
    undo(command){
        if(!command.originalCardData) return;
        this.scene.commandHandler.movementScore-=100;
 
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
       if(!command.originalCardData.wasPenultimateCardRevealed) this.scene.solitaire.tableauPile.hideTopmostCardInTableau(targetPile);
        targetPile.add(newCard);
        sourcePile.list.pop();
  
        return this;
    }
}