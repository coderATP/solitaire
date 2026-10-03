
export class DiscardPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
    }
    
    create(){
        const paddingLeft = 5;
       //pile rectangle 
       const rect = this.scene.createPileRect(
           this.getBiodata().x +this.getBiodata().displayWidth + paddingLeft,
           this.getBiodata().y,
           this.getBiodata().displayWidth,
           this.getBiodata().displayHeight);
       
       //drop zone
       this.zone = this.scene.createDropZone("discardPileZone", rect.x, rect.y, rect.width, rect.height);
       this.container = this.scene.add.container(this.zone.x, this.zone.y);
       this.cards.push(this.container);
       return this;
    }
    getBiodata(){
        return{x: 10*devicePixelRatio,
        y: 50*devicePixelRatio,
        displayWidth: 88*this.config.zoomFactor,
        displayHeight: 128*this.config.zoomFactor
        }
    }
    handleMoveCardToEmptySpace(card){
        //console.log("invalid move: cannot place on empty space");
        card.setPosition(card.getData("x"), card.getData("y"));
    }
    handleMoveCardToDraw(card){
       // console.log("invalid move: cannot place on draw pile");
        card.setPosition(card.getData("x"), card.getData("y"));
    }
    handleMoveCardToDiscard(card){
        card.setPosition(card.getData(card.getData("x")), card.getData("y"));
    }
    handleMoveCardToFoundation(card, dropZone){
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.foundationPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        const isValid = this.isCardValidToMoveToFoundation(card, dropZone);
        
        if(!isValid){
            card.setPosition(0,0);
            return;
        }
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
        
        //If movement is invalid, return early
        const isValid = this.isCardValidToMoveToTableau(card, dropZone);
        if(!isValid){
            card.setPosition(0,0);
            return;
        }
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
    isCardValidToMoveToFoundation(card, dropZone){
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
      
        const cardValue = card.getData("value");
        const cardSuit = card.getData("suit");
        const cardColour = card.getData("colour");
       
        //TO-DO: only aces (data value = 1) can move to empty tableaus
        if(targetPile.list.length === 0){
            if(cardValue === 1){
                return true;
            }
            else{
               // alert("only drop ace on an empty tile")
                return false;
            }
        }
        //idea: for a card to be successfully dropped onto a target pile,
        //1. the card being dragged must have a value 1 more than that of the last card on the target pile.
        //2. it's suit same with the last card on the target pile
        const lastCardInTargetPile = targetPile.list[targetPile.length - 1];
        const targetVal = lastCardInTargetPile.getData("value");
        const targetSuit = lastCardInTargetPile.getData("suit");
        if(cardValue === targetVal+1 &&
           cardSuit === targetSuit
        ){
            return true;
        }
        else{
           // alert("suits: " + cardSuit + targetSuit + ", values: "+ cardValue+", "+targetVal)
           // alert("MOVEMENT RULE:\n1.only cards of same suit can be placed on each other\n2. CARD VALUE should be +1");
            return false;
        }
    } 
    isCardValidToMoveToTableau(card, dropZone){
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
      
        const cardValue = card.getData("value");
        const cardSuit = card.getData("suit");
        const cardColour = card.getData("colour");
        
        //TO-DO: only king (data value = 13) can move to empty tableaus
        if(targetPile.list.length === 0){
            if(cardValue === 13){
                return true;
            }
            else{
               // alert("MOVEMENT RULE:\nonly KINGS can be the first to be dropped onto an empty pile")
                return false;
            }
        }
        //idea: for a card/stack to be successfully dropped onto a target pile,
        //1. the card being dragged must have a value 1 less than that of the last card on the target pile.
        //2. it's colour must not be the same with the last card on the target pile
        const lastCardInTargetPile = targetPile.list[targetPile.length - 1];
        if(cardValue === lastCardInTargetPile.getData("value")-1 &&
           cardColour !== lastCardInTargetPile.getData("colour")
        ){
            return true;
        }
        else{
          //  alert("MOVEMENT RULE:\n1.same card colour cannot be placed on each other\n2. CARD VALUES should differ by 1");
            return false;
        }
    }
    returnToDrawPile(){
        const drawPile = this.scene.solitaire.drawPile;
        
        if(drawPile.container.length > 0) return;
        //drawPile.container = null;
        for( let i =  0; i < this.container.length; ++i){
            const card = this.container.list[i];
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
        this.container.list = [];
        drawPile.container.list.reverse();
        drawPile.zone.setDepth(-1)
        return this;
    }
}