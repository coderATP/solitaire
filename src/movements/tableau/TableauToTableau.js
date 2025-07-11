import { TableauMovement } from "./TableauMovement.js";

export class TableauToTableau extends TableauMovement{
    constructor (scene, card, dropZone){
        super(scene, card, dropZone);
        this.id = "tableauToTableau"
    }
    
    execute(){
        this.originalCardData = [];
        const cardIndex = this.card.getData("cardIndex");
        const pileIndex = this.card.getData("pileIndex");
        const targetPileIndex = this.dropZone.getData("pileIndex");
        const sourcePile = this.scene.solitaire.tableauPile.cards[pileIndex];
        const targetPile = this.scene.solitaire.tableauPile.cards[targetPileIndex];
        const numberOfCardsToMove = sourcePile.length - cardIndex;
        let cardsToMove;
        
        this.isValid = this.scene.solitaire.tableauPile.isCardValidToMoveToTableau(this.card, this.dropZone);
        
        //if card(s) does/do not meet validity conditions to move to another pile, it/they is/are returned to the source pile
        //code is returned early
        //logic: simply reset the position of the card(s) 
        if(!this.isValid){
            this.scene.audio.play(this.scene.audio.errorSound);
            for(let i = 0; i < numberOfCardsToMove; ++i){
                cardsToMove = sourcePile.list[i+cardIndex];
                cardsToMove.setPosition(0, cardsToMove.getData("cardIndex")*20 );
                cardsToMove.setData({x: 0, y: cardsToMove.getData("cardIndex")*20} );
            }
            return;
        }
        this.scene.audio.play(this.scene.audio.dropSound);
        //VALID MOVEMENTS->
        //1. but player drops on the same pile return its position
        //logic: simply reset the position of the card(s)
        if(pileIndex === targetPileIndex){
            if(numberOfCardsToMove===1){
                this.card.setPosition(0, cardIndex*20);
                this.card.setData({x: 0, y: cardIndex*20})
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
             
             const originalCardData = {
                x: targetPile.x,
                y: targetPile.y,
                originalX: this.card.x,
                originalY: this.card.y,
                originalPileIndex: pileIndex,
                currentPileIndex: targetPileIndex,
                originalCardIndex: (sourcePile.length-1)+i,
                currentCardIndex: targetPile.length+i,
                frame: cardsToMove.getData("frame"),
                value: cardsToMove.getData("value"),
                suit: cardsToMove.getData("suit"),
                colour: cardsToMove.getData("colour"),
                numberOfCardsToMove,
                wasPenultimateCardRevealed: sourcePile.list[sourcePile.list.length-2]&& sourcePile.list[sourcePile.list.length-2].getData("frame") > 51 
             }
             this.originalCardData.push(originalCardData);
             targetPile.add(cardGameObject);
        }
        
        //remove card(s) from source pile
        for(let i = 0; i < numberOfCardsToMove; ++i){
            sourcePile.list.pop();
        }
        //reveal topmost card
        this.scene.solitaire.tableauPile.showTopmostCardInTableau(sourcePile);
        setTimeout(()=>{ this.scene.commandHandler.checkWin(); }, 120);
        return this;
    }
    
    undo(command){
        if(!command.originalCardData[0]) return; 
        const numberOfCardsToMove = command.originalCardData[0].numberOfCardsToMove;
        
        let cardToMove;
        const currentCardIndex = command.originalCardData[0].currentCardIndex;
        const sourcePile = this.scene.solitaire.tableauPile.cards[command.originalCardData[0].currentPileIndex];
        const targetPile = this.scene.solitaire.tableauPile.cards[command.originalCardData[0].originalPileIndex];
        
        //hide topmost card back
        this.scene.solitaire.tableauPile.hideTopmostCardInTableau(targetPile);

        for(let i = 0; i < numberOfCardsToMove; ++i){
            cardToMove = sourcePile.list[i+currentCardIndex];
            const cardGameObject = this.scene.createCard("tableauPileCard", 0, (targetPile.length)*20);
            cardGameObject
                .setFrame(cardToMove.getData("frame"))
                .setInteractive({draggable: true})
            cardGameObject.setData({
                 x: cardGameObject.x,
                 y: cardGameObject.y,
                 frame: cardToMove.getData("frame"),
                 value: cardToMove.getData("value"),
                 suit: cardToMove.getData("suit"),
                 colour: cardToMove.getData("colour"),
                 pileIndex: command.originalCardData[0].originalPileIndex,
                 cardIndex: targetPile.length+i
            }); 
            targetPile.add(cardGameObject);
        }
        for(let i = 0; i < numberOfCardsToMove; ++i){
            sourcePile.list.pop();
        }
        return this; 
    }
}