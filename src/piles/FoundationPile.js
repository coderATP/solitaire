export class FoundationPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
        this.dropZones = [];
    }
    
    create(){
        
        for(let i = 3; i >= 0; --i){
            let foundationCard = this.scene.createCard(
                "foundationPileCard",
                this.config.width - ( (i* this.getBiodata().padding) + this.getBiodata().displayWidth) - this.getBiodata().marginRight,
                this.getBiodata().y,
                true
            );
            
            foundationCard.setData({x: foundationCard.x, y: foundationCard.y});
            
            //4 containers for each pile
            const container = this.scene.add.container(
                this.config.width - ( (i* this.getBiodata().padding) + this.getBiodata().displayWidth) - this.getBiodata().marginRight,
                this.getBiodata().y
            );
            this.cards.unshift(container);
            
            //pile rectangle 
            this.scene.createPileRect(foundationCard.x, foundationCard.y, foundationCard.displayWidth, foundationCard.displayHeight);
        
            //drop zone
            const zoneWidth =  foundationCard.displayWidth;
            const zoneHeight = foundationCard.displayHeight; 
            const zoneX = foundationCard.x
            const zoneY = foundationCard.y

            const zone = this.scene.createDropZone("foundationPileZone", zoneX, zoneY, zoneWidth, zoneHeight)
                .setData({pileIndex: i})
            this.dropZones.unshift(zone);
            
            foundationCard.destroy();
        }
        
        return this;
    }
    getBiodata(){
        return{x: 10,
            y: 20,
            displayWidth: 37,
            displayHeight: 52,
            padding: 37 + 5,
            marginRight: 10
        };
    }
    
    handleMoveCardToTableau(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.foundationPile.cards[pileIndex];
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
    
    handleMoveToEmptySpace(card){
        console.log("cannot place on empty space");
        card.setPosition(0, 0);
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
        if(targetPile.length !== 0) return;
        
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
            x: targetPile.x,
            y: targetPile.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })
         
        targetPile.add(newCard);
        card.destroy() // sourcePile.list.pop() does not work
        
        return this;
    } 

}