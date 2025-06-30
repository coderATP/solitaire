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
            y: 50,
            displayWidth: 88*this.config.zoomFactor,
            displayHeight: 128*this.config.zoomFactor,
            padding: 88*this.config.zoomFactor + 1,
            marginRight: 10
        };
    }
    handleMoveCardToTableau(card, dropZone){
        const isValid = this.isCardValidToMoveToTableau(card, dropZone);
        
        if(!isValid){
            card.setPosition(0,0);
            return;
        } 
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
    handleMoveCardToEmptySpace(card){
        card.setPosition(0, 0);
    }
    handleMoveCardToDiscard(card){
       // console.log("invalid move: cannot place from foundation to discard");
        card.setPosition(0, 0); 
    }
    handleMoveCardToDraw(card, dropZone){
        //console.log("invalid move: cannot place on draw pile");
        card.setPosition(0, 0);
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
               /* alert("values: "+ cardValue + "," + lastCardInTargetPile.getData("value"),
                    "suits: " + cardSuit + ", " + lastCardInTargetPile.getData("suit")
                );
                */
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
           // alert("MOVEMENT RULE:\n1.same card colour cannot be placed on each other\n2. CARD VALUES should differ by 1");
            return false;
        }
    }
    isCardValidToMoveToFoundation(card, dropZone){
        const targetPileIndex = dropZone.getData("pileIndex");
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
      
        const cardValue = card.getData("value");
        const cardSuit = card.getData("suit");
        const cardColour = card.getData("colour");
       
        //TO-DO: only aces (data value = 1) can move to empty tableaus
        if(targetPile.list.length === 0){
            if(cardValue !== 1){
               // alert("MOVEMENT RULE:\nonly aces can be the first to be dropped onto an empty pile")
               // console.log("card value: ",cardValue);
                return false;
            }
        //idea: for a card to be successfully dropped onto a target pile,
        //1. the card being dragged must have a value 1 more than that of the last card on the target pile.
        //2. it's suit same with the last card on the target pile 
        }
        else{
            const lastCardInTargetPile = targetPile.list[targetPile.length - 1];
            if(cardValue !== lastCardInTargetPile.getData("value")+1 ||
               cardSuit !== lastCardInTargetPile.getData("suit")
            ){
              /*  alert("values: "+ cardValue + "," + lastCardInTargetPile.getData("value"),
                    "suits: " + cardSuit + ", " + lastCardInTargetPile.getData("suit")
                );
                */
                return false;
            } 
        }

        return true;
    }
    handleMoveCardToFoundation(card, dropZone){
        const isValid = this.isCardValidToMoveToFoundation(card, dropZone);
        if(!isValid){
            card.setPosition(0,0);
            return;
        }
        const cardIndex = card.getData("cardIndex");
        const pileIndex = card.getData("pileIndex");
        const targetPileIndex = dropZone.getData("pileIndex"); 

        const sourcePile = this.scene.solitaire.foundationPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.foundationPile.cards[targetPileIndex];
        
        if(pileIndex === targetPileIndex ){
            card.setPosition(0,0);
            return;
        }
        //TO-DO: move card from foundation to foundation
        //idea: do not bother moving if targetPile is not empty
        if(targetPile.length !== 0){
            card.setPosition(0,0);
            return;
        }
        
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