import { FoundationMovement } from "./FoundationMovement.js";

export class FoundationToFoundation extends FoundationMovement{
    constructor(scene, card, dropZone){
        super(scene, card, dropZone)
        this.id = "foundationToFoundation";
    }
    
    execute(){
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.foundationPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        this.isValid = this.scene.solitaire.foundationPile.isCardValidToMoveToFoundation(this.card, this.dropZone);
       // this.isValid = false;
        if(!this.isValid){
            this.scene.audio.play(this.scene.audio.errorSound);
            this.card.setPosition(0,0);
            this.originalCard = this.card;
            return;
        }
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
            originalPileIndex: pileIndex,
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
        const sourcePile = this.scene.solitaire.foundationPile.cards[command.originalCardData.targetPileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[command.originalCardData.originalPileIndex];
        
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        this.newCard = this.scene.createCard("foundationPileCard", 0, 0)
        this.newCard
        .setInteractive({draggable: true})
        .setFrame(command.originalCardData.frame)
        .setData({
            frame: command.originalCardData.frame,
            value: command.originalCardData.value,
            suit: command.originalCardData.suit,
            colour: command.originalCardData.colour,
            x: targetPile.x,
            y: targetPile.y,
            originalPileIndex: command.originalCardData.originalPileIndex,
            targetPileIndex: command.originalCardData.targetPileIndex,
            cardIndex: targetPile.list.length
        })
        
        targetPile.add(this.newCard);
        sourcePile.list.pop();
        this.scene.commandHandler.checkWin();
        
        return this; 
    }
}