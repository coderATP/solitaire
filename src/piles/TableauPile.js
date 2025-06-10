export class TableauPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
        this.dropZones = [];
    }
    
    create(){
        //3 cards
        let card, tableauCard;
        
        card = {
            displayWidth: 37 * this.config.zoomFactor
        }
        
        let marginLeft = 20, marginRight = 20, marginTop = this.getBioData().y + this.getBioData().displayHeight + 20;
        const availableWidthTotal = this.config.width - (marginLeft + marginRight);
        const cardsWidthTotal = card.displayWidth * 7;
        const availablePaddingSpaceTotal = availableWidthTotal - cardsWidthTotal;
        const padding = availablePaddingSpaceTotal/6;
        
        for(let i = 0; i < 7; ++i){
            //7 zone gameobjects
             this.zone = this.scene.add.zone(
                 marginLeft + i* (padding+card.displayWidth),
                 marginTop+marginTop*2,
                card.displayWidth,
                this.config.height - marginTop
            );
            this.zone
            .setRectangleDropZone(this.zone.width, this.zone.height)
            .setOrigin(0)
            .setName("tableauPileZone")
            .setData({pileIndex: i})
            
            this.scene.add.rectangle(this.zone.x, this.zone.y, this.zone.width, this.zone.height, 0xff4000, 0.3)
                .setOrigin(0)
                .setDepth(1)
        }
        return this;
    }
    
    getBioData(){
        let y = 20,
             displayHeight= 52 * this.config.zoomFactor,
             displayWidth= 37 * this.config.zoomFactor;
        
        let marginLeft = 20, marginRight = 20, marginTop = y + displayHeight + 200;
        
        const availableWidthTotal = this.config.width - (marginLeft + marginRight);
        const cardsWidthTotal = displayWidth * 7;
        const availablePaddingSpaceTotal = availableWidthTotal - cardsWidthTotal;
        const padding = availablePaddingSpaceTotal/6;
        
        return {y, displayWidth, displayHeight, marginRight, marginLeft, marginTop, padding}
    }
    
    handleMoveToEmptySpace(card){
        console.log("cannot place on empty space");
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
 
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToMove;
     
        //TO-DO: if player drops on the same pile return its position
        //logic: simply reset the position of the card(s)
         for(let i = 0; i < numberOfCardsToMove; ++i){
            cardsToMove = sourcePile.list[i+cardIndex];
            cardsToMove.setPosition(0, cardsToMove.getData("cardIndex")*20 );
            cardsToMove.setData({x: 0, y: cardsToMove.getData("cardIndex")*20} );
        }
        return;
    }
    handleMoveCardToTableau(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToMove;
     
        //TO-DO: if player drops on the same pile return its position
        //logic: simply reset the position of the card(s)
        if(pileIndex === targetPileIndex){
            if(numberOfCardsToMove===1){
                card.setPosition(0, cardIndex*20);
                card.setData({x: 0, y: cardIndex*20})
                return;
            }
            else{
                for(let i = 0; i < numberOfCardsToMove; ++i){
                    cardsToMove = sourcePile.list[i+cardIndex];
                    cardsToMove.setPosition(0, cardsToMove.getData("cardIndex")*20 );
                    cardsToMove.setData({x: 0, y: cardsToMove.getData("cardIndex")*20} );
                }
                return;
            }
        }

        //TO-DO: move multiple cards at a time
        //idea: create number of cards being moved, add them to the target pile and destroy the original (stack of) cards being moved

        for(let i = 0; i < numberOfCardsToMove; ++i){
            const cardGameObject = this.scene.createCard("tableauPileCard", 0, targetPile.length*20 )
                .setInteractive({draggable: true})
                
            cardsToMove = sourcePile.list[i+cardIndex];

             cardGameObject.setFrame(cardsToMove.getData("frame"))
             cardGameObject.setData({
                 x: cardGameObject.x,
                 y: cardGameObject.y,
                 frame: cardsToMove.getData("frame"),
                 value: cardsToMove.getData("value"),
                 suit: cardsToMove.getData("suit"),
                 colour: cardsToMove.getData("colour"),
                 pileIndex: targetPileIndex,
                 cardIndex: targetPile.length
             });

            targetPile.add(cardGameObject);
        }
        
        
        //remove card(s) from source pile
        for(let i = 0; i < numberOfCardsToMove; ++i){
            sourcePile.list.pop();
        }
       
        return this;
    }
    handleMoveCardToFoundation(card, dropZone){
        //TO-DO: move a valid card to foundation
        //only one card can be moved at a time from the tableau to foundation
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
 
        if(cardIndex < sourcePile.length-1 ){
           //throw new Error("moving multiple cards is invalid")
            return;
        }
        
        const newCard = this.scene.createCard("foundationPileCard", 0, 0)
        newCard.data = card.data;
        newCard
        .setInteractive({draggable: true})
        .setFrame(newCard.getData("frame"));
        
        targetPile.add(newCard);
        sourcePile.list.pop(); //card.destroy() also works
        return this;
    }

}