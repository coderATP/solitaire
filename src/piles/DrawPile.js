export class DrawPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
    }
    
    create(){
       
       //pile rectangle 
       this.scene.createPileRect(this.getBiodata().x, this.getBiodata().y, this.getBiodata().displayWidth, this.getBiodata().displayHeight);
       //drop zone
       this.zone = this.scene.createDropZone("drawPileZone", this.getBiodata().x, this.getBiodata().y, this.getBiodata().displayWidth, this.getBiodata().displayHeight);
       return this;
    }
    
    getBiodata(){
        return{x: 10, y: 20, displayWidth: 37, displayHeight: 52};
    }
    handleMoveCardToDiscard(card){
        const targetPile = this.scene.solitaire.discardPile.cards;
        const newCard = this.scene.createCard("discardPileCard", this.scene.solitaire.discardPile.zone.x, this.scene.solitaire.discardPile.zone.y);
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
                cardIndex: targetPile.length
            })
        this.scene.solitaire.discardPile.cards.push(newCard);
        card.destroy();
    }

}