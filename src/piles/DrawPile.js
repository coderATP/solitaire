export class DrawPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
        this.container = undefined;
    }
    
    create(){
       
       //pile rectangle 
       this.rect = this.scene.createPileRect(this.getBiodata().x, this.getBiodata().y, this.getBiodata().displayWidth, this.getBiodata().displayHeight);
       //drop zone
       this.zone = this.scene.createDropZone("drawPileZone", this.getBiodata().x, this.getBiodata().y, this.getBiodata().displayWidth, this.getBiodata().displayHeight);
       
       return this;
    }
    
    getBiodata(){
        return{x: 10, y: 20, displayWidth: 37, displayHeight: 52};
    }
    
    handleMoveCardToDiscard(card){
        const targetPile = this.scene.solitaire.discardPile.container;
        const newCard = this.scene.createCard("discardPileCard", 0,0);
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
        targetPile.add(newCard);
        card.destroy();
        this.cards.pop();
        //this.updateTopmostTwoCardsPosition();
    }
    updateTopmostTwoCardsPosition(){
        if(this.container.list.length > 0){
            if(this.container.list[1]){
                this.container.list[1].setPosition(-6,0);
            }
            if(this.container.list[2]){
                this.container.list[2].setPosition(-3,0);
            } 
            
        }
    }
}