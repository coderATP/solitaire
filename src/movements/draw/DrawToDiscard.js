import {DrawMovement} from "./DrawMovement.js";

export class DrawToDiscard extends DrawMovement{
   constructor(scene, card, dropZone){
       super(scene, card, dropZone);
       this.id = "drawToDiscard";
   }
    execute(){
        const targetPile = this.scene.solitaire.discardPile.container;
        const newCard = this.scene.createCard("discardPileCard", 0,0);
        newCard
            .setInteractive({draggable: true})
            .setFrame(this.card.getData("frame"))
            .setData({
                frame: this.card.getData("frame"),
                value: this.card.getData("value"),
                suit: this.card.getData("suit"),
                colour: this.card.getData("colour"),
                x: newCard.x,
                y: newCard.y,
                cardIndex: targetPile.length
            })
        targetPile.add(newCard);
        this.card.destroy();
        this.scene.solitaire.drawPile.cards.pop();
        //this.updateTopmostTwoCardsPosition(); 
    }
    undo(){
        const targetPile = this.scene.solitaire.drawPile.container;
        const undoPile = this.scene.solitaire.discardPile.container;
        const undoCard = undoPile.list[undoPile.list.length - 1];
        if(!undoCard) return;
        this.tempCard = undoCard;
        const newCard = this.scene.createCard("drawPileCard", 0,0);
        newCard
            .setInteractive({draggable: false})
            .setFrame(52)
            .setData({
                frame: undoCard.getData("frame"),
                value: undoCard.getData("value"),
                suit: undoCard.getData("suit"),
                colour: undoCard.getData("colour"),
                x: newCard.x,
                y: newCard.y,
                cardIndex: targetPile.length
            })
        targetPile.add(newCard);
        undoCard.destroy();
        this.scene.solitaire.discardPile.cards.pop(); 
    }

}