import { DiscardMovement } from "./DiscardMovement.js";


export class DiscardToFoundation extends DiscardMovement{
    constructor(scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "discardToFoundation";
    }
    
    execute(){
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.discardPile.container;
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        this.isValid = this.scene.solitaire.discardPile.isCardValidToMoveToFoundation(this.card, this.dropZone);
        
        if(!this.isValid){
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0,0);
            return;
        }
        //increase score
        this.scene.commandHandler.movementScore+=5;
        //play sound
        this.scene.audio.play(this.scene.audio.dropSound);
        if(pileIndex === targetPileIndex ) return;
        //TO-DO: move card from discard to foundation
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        this.newCard = this.scene.createCard("foundationPileCard", 0, 0)
        this.newCard
        .setInteractive({draggable: true})
        .setFrame(this.card.getData("frame"))
        .setData({
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
            x: this.newCard.x,
            y: this.newCard.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })
        
        this.originalCardData = {
            x: targetPile.x,
            y: targetPile.y,
            originalPileIndex: "it's discard",
            targetPileIndex: targetPileIndex,
            cardIndex: targetPile.length,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"), 
        }
        
        targetPile.add(this.newCard);
        sourcePile.list.pop();
        this.scene.commandHandler.checkWin();
        return this;
    }
    
    undo(command){
        if(!command.originalCardData) return;
        this.scene.commandHandler.movementScore-=5; 
        //const pileIndex = this.card.getData("pileIndex");
        const sourcePile = this.scene.solitaire.foundationPile.cards[command.originalCardData.targetPileIndex];
        const targetPile = this.scene.solitaire.discardPile.container;
        
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        this.newCard = this.scene.createCard("discardPileCard", 0, 0)
        this.newCard
        .setInteractive({draggable: true})
        .setFrame(command.originalCardData.frame)
        .setData({
            frame: command.originalCardData.frame,
            value: command.originalCardData.value,
            suit: command.originalCardData.suit,
            colour: command.originalCardData.colour,
            x: this.newCard.x,
            y: this.newCard.y,
            originalPileIndex: command.originalCardData.targetPileIndex,
            targetPileIndex: command.originalCardData.originalPileIndex,
            cardIndex: targetPile.list.length
        })
        
        targetPile.add(this.newCard);
        sourcePile.list.pop();
        this.scene.commandHandler.checkWin();
        return this; 
    }
}