import { DiscardMovement } from "./DiscardMovement.js";

export class DiscardToTableau extends DiscardMovement{
    constructor (scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "discardToTableau"
    }
    
    execute(){
        this.isValid = this.scene.solitaire.discardPile.isCardValidToMoveToTableau(this.card, this.dropZone);
        
        if(!this.isValid){
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0,0);
            return;
        }
        
        this.scene.audio.play(this.scene.audio.dropSound); 
        const cardIndex = this.card.getData("cardIndex");
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.discardPile.container;
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
        
        //TO-DO: move card from foundation to tableau
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        const newCard = this.scene.createCard("tableauPileCard", 0, targetPile.length *20);
        
        newCard
        .setFrame(this.card.getData("frame"))
        .setInteractive({draggable: true })
        .setData({
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            x: newCard.x,
            y: newCard.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })
        
        this.originalCardData = {
            originalCardIndex: this.card.getData("cardIndex"),
            originalPileIndex: pileIndex,
            currentPileIndex: targetPileIndex,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            x: newCard.x,
            y: newCard.y,
            
        }
        targetPile.add(newCard);
        sourcePile.list.pop();
        this.scene.commandHandler.checkWin();
      
        return this;
    }
    
    
    undo(command){
        if(!command.originalCardData) return;
        const sourcePile = this.scene.solitaire.tableauPile.cards[command.originalCardData.currentPileIndex];
        const targetPile = this.scene.solitaire.discardPile.container;
        
        const newCard = this.scene.createCard("discardPileCard", 0, 0);
        
        newCard
        .setFrame(command.originalCardData.frame)
        .setInteractive({draggable: true })
        .setData({
            frame: command.originalCardData.frame,
            value: command.originalCardData.value,
            suit: command.originalCardData.suit,
            colour: command.originalCardData.suit,
            x: newCard.x,
            y: newCard.y,
            pileIndex: command.originalCardData.originalPileIndex,
            cardIndex: targetPile.length
        })
        targetPile.add(newCard);
        
        sourcePile.list.pop();
        return this;
    }
    
}