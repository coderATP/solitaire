import { DiscardMovement } from "./DiscardMovement.js";
import { audio } from "../../audio/AudioControl.js";


export class DiscardToFoundation extends DiscardMovement{
    constructor(scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "discardToFoundation";
    }
    
    execute(){
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.discardPile.cards.container;
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        //i created a reference to the present dropZone for later when i need to undo a move
        this.oldDropZone = this.dropZone;
        
        this.isValid = this.scene.solitaire.discardPile.isCardValidToMoveToFoundation(this.card, this.dropZone);
        
        if(!this.isValid){
            audio.play(audio.errorSound);
            this.card.setPosition(0,0);
            return;
        }
        audio.play(audio.dropSound);
      //  if(pileIndex === targetPileIndex ) return;
        //TO-DO: move card from foundation to foundation
        //idea: do not bother moving if targetPile is not empty
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
        this.card.destroy();
        return this;
    }
    
    undo(command){
        if(!command.originalCardData) return;
        //const pileIndex = this.card.getData("pileIndex");
        const currentPile = this.scene.solitaire.foundationPile.cards[command.originalCardData.targetPileIndex];
        const targetPile = this.scene.solitaire.discardPile.container;

        //TO-DO: move card from foundation to foundation
        //idea: do not bother moving if targetPile is not empty
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
            x: targetPile.x,
            y: targetPile.y,
            originalPileIndex: command.originalCardData.originalPileIndex,
            currentPileIndex: command.originalCardData.currentPileIndex,
            cardIndex: targetPile.list.length
        })
        
        targetPile.add(this.newCard);
        currentPile.list.pop();
        //this.card.destroy();
        return this; 
    }
}