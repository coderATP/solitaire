import { FoundationMovement } from "./FoundationMovement.js";
import { audio } from "../../audio/AudioControl.js";

export class FoundationToFoundation extends FoundationMovement{
    constructor(scene, card, dropZone){
        super(scene, card, dropZone)
        this.id = "foundationToFoundation";
    }
    
    execute(){
        const isValid = this.scene.solitaire.foundationPile.isCardValidToMoveToFoundation(this.card, this.dropZone);
        if(!isValid){
            audio.play(audio.errorSound);
            this.card.setPosition(0,0);
            return;
        }
        audio.play(audio.dropSound);
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex"); 

        const sourcePile = this.scene.solitaire.foundationPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        if(pileIndex === targetPileIndex ){
            this.card.setPosition(0,0);
            return;
        }
        //TO-DO: move card from foundation to foundation
        //idea: do not bother moving if targetPile is not empty
        if(targetPile.length !== 0){
            this.card.setPosition(0,0);
            return;
        }
        
        //create a reference to current dropZone, and old card pileIndex
        //you'll need it when you want to undo a move
        this.currentPileIndex = this.dropZone.getData("pileIndex");
        this.originalPileIndex = pileIndex;
        
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        this.originalCard = this.scene.createCard("foundationPileCard", 0, 0)
        this.originalCard
        .setInteractive({draggable: true})
        .setFrame(this.card.getData("frame"))
        .setData({
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
            originalPileIndex: pileIndex,
            currentPileIndex: targetPileIndex,
            cardIndex: targetPile.length,
            frame: this.card.getData("frame"),
            value: this.card.getData("value"),
            suit: this.card.getData("suit"),
            colour: this.card.getData("colour"),
        }
        targetPile.add(this.originalCard);
        this.card.destroy() // sourcePile.list.pop() does not work

        return this;
    }
    
    undo(command){
        const sourcePile = this.scene.solitaire.foundationPile.cards[command.originalCardData.currentPileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[command.originalCardData.originalPileIndex];
        
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        this.originalCard = this.scene.createCard("foundationPileCard", 0, 0)
        this.originalCard
        .setInteractive({draggable: true})
        .setFrame(command.originalCardData.frame)
        .setData({
            frame: command.originalCardData.frame,
            value: command.originalCardData.value,
            suit: command.originalCardData.suit,
            colour: command.originalCardData.colour,
            x: targetPile.x,
            y: targetPile.y,
            pileIndex: command.originalCardData.originalPileIndex,
            cardIndex: targetPile.length
        })
        
        targetPile.add(this.originalCard);
        //this.card.destroy()
        sourcePile.list.pop() //
        
        return this; 
    }
}