import { DiscardMovement } from "./DiscardMovement.js";

export class DiscardToDraw extends DiscardMovement{
    constructor(scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "discardToDraw";
    }
    
    execute(){
        const drawPile = this.scene.solitaire.drawPile;
        const discardPile = this.scene.solitaire.discardPile; 
        
      //  if(drawPile.container.length > 0) return;
        //drawPile.container = null;
        for( let i =  0; i < discardPile.container.length; ++i){
            const card = discardPile.container.list[i];
            const newCard = this.scene.createCard("drawPileCard", 0, 0);
            newCard
            .setFrame(52)
            .setInteractive({draggable: false})
            .setDepth(5)
            .setData({
                frame: card.getData("frame"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                colour: card.getData("colour"),
                x: newCard.x,
                y: newCard.y,
            })
            drawPile.container.add(newCard);
        }
        discardPile.container.list = [];
        drawPile.container.list.reverse();
        drawPile.zone.setDepth(-1)
        return this;
    }
    
    undo(){
        const drawPile = this.scene.solitaire.drawPile;
        const discardPile = this.scene.solitaire.discardPile; 

        for( let i =  0; i < drawPile.container.length; ++i){
            const card = drawPile.container.list[i];
            const newCard = this.scene.createCard("discardPileCard", 0, 0);
            newCard
            .setFrame(card.getData("frame"))
            .setInteractive({draggable: true})
            .setDepth(5)
            .setData({
                frame: card.getData("frame"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                colour: card.getData("colour"),
                x: newCard.x,
                y: newCard.y,
            })
            discardPile.container.add(newCard);
        }
        drawPile.container.list.forEach(card=>{
            card.destroy();
        })
        drawPile.container.list = [];
        discardPile.container.list.reverse();
        return this;
    }
}