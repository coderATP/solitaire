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
            displayWidth: 88*this.config.zoomFactor,
            displayHeight: 128*this.config.zoomFactor
        }
        
        let marginLeft = 10, marginRight = 10, marginTop = this.getBioData().y + this.getBioData().displayHeight + 80;
        const availableWidthTotal = this.config.width - (marginLeft + marginRight);
        const cardsWidthTotal = card.displayWidth * 7;
        const availablePaddingSpaceTotal = availableWidthTotal - cardsWidthTotal;
        const padding = availablePaddingSpaceTotal/6;
        
        for(let i = 0; i < 7; ++i){
            //7 zone gameobjects
             this.zone = this.scene.add.zone(
                 marginLeft+i* (padding+card.displayWidth),
                 marginTop,
                card.displayWidth,
                this.config.height - marginTop
            );
            this.zone
            .setRectangleDropZone(this.zone.width, this.zone.height)
            .setOrigin(0)
            .setName("tableauPileZone")
            .setData({pileIndex: i})
            
            this.scene.add.rectangle(this.zone.x, this.zone.y, this.zone.width, this.zone.height, 0xff4000, 0.0)
                .setOrigin(0)
        }
        return this;
    }
    getBioData(){
        let y = 50,
        displayWidth = 88*this.config.zoomFactor,
        displayHeight = 128*this.config.zoomFactor;
        let marginLeft = 10, marginRight = 10, marginTop = y + displayHeight + 80;
        
        const availableWidthTotal = this.config.width - (marginLeft + marginRight);
        const cardsWidthTotal = displayWidth * 7;
        const availablePaddingSpaceTotal = availableWidthTotal - cardsWidthTotal;
        const padding = availablePaddingSpaceTotal/6;
        
        return {y, displayWidth, displayHeight, marginRight, marginLeft, marginTop, padding}
    }
    handleMoveCardToEmptySpace(card){
        //console.log("cannot place on empty space");
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
    isCardValidToMoveToFoundation(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        
        const cardValue = card.getData("value");
        const cardSuit = card.getData("suit");
        const cardColour = card.getData("colour");
       
       //accept drop onto foundation pile if it's only one card
       if(numberOfCardsToMove > 1){
           //alert("you can only drop one card onto foundation")
           return false;
       }
        //TO-DO: only aces (data value = 0) can move to empty tableaus
        if(targetPile.list.length === 0){
            if(cardValue !== 1){
                //alert("drop ace on empty tile")
                return false;
            }else return true;
        }
        else{
            //idea: for a card to be successfully dropped onto a target pile,
            //1. the card being dragged must have a value 1 more than that of the last card on the target pile.
            //2. it's suit same with the last card on the target pile
            const lastCardInTargetPile = targetPile.list[targetPile.length - 1];
            const targetVal = lastCardInTargetPile.getData("value");
            const targetSuit = lastCardInTargetPile.getData("suit");
            if(cardValue !== targetVal+1 ||
               cardSuit !== targetSuit
            ){
               /* alert("values: "+ cardValue + "," + targetVal+
                    " suits: " + cardSuit + ", " + targetSuit
                );
                */
                return false;
            } 
        }
        return true;
    }  
    isCardValidToMoveToTableau(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToMove;
      
        const cardValue = card.getData("value");
        const cardSuit = card.getData("suit");
        const cardColour = card.getData("colour");
       
        //TO-DO:
        // if tableau is empty, only king (data value = 13) can take the space
        if(targetPile.list.length === 0){
            if(cardValue === 13){ return true; }
        }
        //TO-DO: if tableau is not empty,
        //idea:
        // get the topmost card on the target
        // get the topmost card on the source
        //compare their values and colours
        //value of target must be +1 higher than the source,
        //colours of target and source must be different
        else{
            const lastCardInTargetPile = targetPile.list[targetPile.length - 1];
            if(cardValue === lastCardInTargetPile.getData("value")-1 &&
               cardColour !== lastCardInTargetPile.getData("colour")
            ){
                for(let i = 0; i < numberOfCardsToMove; ++i){
                    const previousCardOnStack = sourcePile.list[i+cardIndex]; 
                    const nextCardOnStack = sourcePile.list[i+cardIndex+1] ? sourcePile.list[i+cardIndex+1] : null;
                    
                    //return true early if it's only one card being moved 
                    if(numberOfCardsToMove === 1) return true;
                    //for multiple cards,
                    //return true when you've reached the last card
                    if(nextCardOnStack === null ) {return true;}
                    //1. the subsequent cards from top to bottom must be less than each other by a value of 1,
                    //2. they must also have alternating colours
                    if(previousCardOnStack.getData("value") === nextCardOnStack.getData("value")-1 &&
                        previousCardOnStack.getData("colour") !== nextCardOnStack.getData("colour")
                    ){
                        return true;
                    }
                }
            }
        }
        //if all else fails, card(s) cannot be moved, return false;
        return false;
    }
    handleMoveCardToTableau(card, dropZone){

        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToMove;
        
        const isValid = this.isCardValidToMoveToTableau(card, dropZone);
        
        //if card(s) does/do not meet validity conditions to move to another pile, it/they is/are returned to the source pile
        //code is returned early
        //logic: simply reset the position of the card(s) 
        if(!isValid){
            //alert("not a valid move")
            for(let i = 0; i < numberOfCardsToMove; ++i){
                cardsToMove = sourcePile.list[i+cardIndex];
                cardsToMove.setPosition(0, cardsToMove.getData("cardIndex")*20 );
                cardsToMove.setData({x: 0, y: cardsToMove.getData("cardIndex")*20} );
            }
            return;
        }
        
        //VALID MOVEMENTS->
        //1. but player drops on the same pile return its position
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
        
        //2. player drops on a new pile
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
        this.scene.solitaire.flipTopmostCardInTableau(sourcePile);
        return this;
    }
    handleMoveCardToDiscard(card, dropZone){
        this.handleMoveCardToEmptySpace(card);
    }
    handleMoveCardToDraw(card, dropZone){
        this.handleMoveCardToEmptySpace(card);
    } 
    handleMoveCardToFoundation(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
  
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToReturn;
        const isValid = this.isCardValidToMoveToFoundation(card, dropZone);
        if(!isValid){
            for(let i = 0; i < numberOfCardsToMove; ++i){
                cardsToReturn = sourcePile.list[i+cardIndex];
                cardsToReturn.setPosition(0, cardsToReturn.getData("cardIndex")*20 );
                cardsToReturn.setData({x: 0, y: cardsToReturn.getData("cardIndex")*20} );
            }
            return;
        }
        //TO-DO: move a valid card to foundation
        //only one card can be moved at a time from the tableau to foundation
        if(cardIndex < sourcePile.length-1 ){
           //throw new Error("moving multiple cards is invalid")
            return;
        }
        
        const newCard = this.scene.createCard("foundationPileCard", 0, 0)
        newCard.setData({
            frame: card.getData("frame"),
            value: card.getData("value"),
            suit: card.getData("suit"),
            colour: card.getData("colour"),
            x: targetPile.x,
            y: targetPile.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        })
        newCard
        .setInteractive({draggable: true})
        .setFrame(newCard.getData("frame"));
        
        targetPile.add(newCard);
        card.destroy();
        //sourcePile.list.pop(); //card.destroy() also works
        this.scene.solitaire.flipTopmostCardInTableau(sourcePile);
 
        return this;
    }
    showTopmostCardInTableau(targetPile){
        //return if container is empty
        if(targetPile.list.length === 0) return;
        const topmostCard = targetPile.list[targetPile.list.length-1];
        const cardFrame = topmostCard.getData("frame");
        topmostCard.setFrame(cardFrame);
    }
    hideTopmostCardInTableau(targetPile){
        const topmostCard = targetPile.list[targetPile.list.length-1];
        topmostCard&& topmostCard.setFrame(52);
    }  

}