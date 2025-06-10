export class DiscardPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
    }
    
    create(){
        const paddingLeft = 20;
       //pile rectangle 
       const rect = this.scene.createPileRect(
           this.getBiodata().x + this.getBiodata().displayWidth + paddingLeft,
           this.getBiodata().y,
           this.getBiodata().displayWidth,
           this.getBiodata().displayHeight);
       
       //drop zone
       this.zone = this.scene.createDropZone("discardPileZone", rect.x, rect.y, rect.width, rect.height);
   
       return this;
    }
    getBiodata(){
        return{x: 10, y: 20, displayWidth: 37, displayHeight: 52};
    }
    handleMoveCardToFoundation(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.foundationPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        if(pileIndex === targetPileIndex ) return;
        //TO-DO: move card from foundation to foundation
        //idea: do not bother moving if targetPile is not empty
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        const newCard = this.scene.createCard("foundationPileCard", 0, 0)
        newCard
        .setInteractive({draggable: true})
        .setFrame(card.getData("frame"))
        .setData({
            frame: card.getData("frame"),
            value: card.getData("value"),
            suit: card.getData("suit"),
            colour: card.getData("colour"),
            x: newCard.x,
            y: newCard.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })
         
        targetPile.add(newCard);
        card.destroy();
        
        return this;
    } 
    handleMoveCardToTableau(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
        
        //TO-DO: move card from foundation to tableau
        //idea: create a new card, add it to the target pile and destroy the original card being moved
        const newCard = this.scene.createCard("tableauPileCard", 0, targetPile.length *20);
        
        newCard
        .setFrame(card.getData("frame"))
        .setInteractive({draggable: true })
        .setData({
            frame: card.getData("frame"),
            value: card.getData("value"),
            suit: card.getData("suit"),
            colour: card.getData("colour"),
            x: newCard.x,
            y: newCard.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })
        
        targetPile.add(newCard);
        card.destroy();
      
        return this;
    }
}