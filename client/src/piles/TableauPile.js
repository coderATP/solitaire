export class TableauPile {

    constructor(scene) {
    
    this.scene = scene;
    this.config = scene.config;
    this.graphics = scene.graphics;
    
    this.cards = [];
    this.dropZones = [];
    this.pileRects = [];
}


create() {
    
    this.dropZones = [];
    this.pileRects = [];
    
    for (let i = 0; i < 7; ++i) {
        
        const zone =
            this.scene.add.zone(
                0,
                0,
                1,
                1
            );
        
        zone
            .setRectangleDropZone(
                1,
                1
            )
            .setOrigin(0)
            .setName("tableauPileZone")
            .setData({
                pileIndex: i
            });
        
        const rect =
            this.scene.add.rectangle(
                0,
                0,
                1,
                1,
                0xff4000,
                0.0
            ).setOrigin(0);
        
        
        this.dropZones.push(zone);
        this.pileRects.push(rect);
    }
    
    return this;
}


    handleMoveCardToEmptySpace(card){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.tableauPile.cards[pileIndex];

        const numberOfCardsToMove =
            sourcePile.length - cardIndex;

        let cardsToMove;

        for(let i = 0; i < numberOfCardsToMove; ++i){

            cardsToMove =
                sourcePile.list[i + cardIndex];

            cardsToMove.setPosition(
                0,
                cardsToMove.getData("cardIndex") * 40
            );

            cardsToMove.setData({
                x: 0,
                y: cardsToMove.getData("cardIndex") * 40
            });
        }

        return;
    }


    isCardValidToMoveToFoundation(card, dropZone){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.foundationPile.cards[targetPileIndex];

        const sourcePile =
            this.scene.solitaire.tableauPile.cards[pileIndex];

        const numberOfCardsToMove =
            sourcePile.length - cardIndex;

        const cardValue =
            card.getData("value");

        const cardSuit =
            card.getData("suit");

        const cardColour =
            card.getData("colour");

        if(numberOfCardsToMove > 1){
            return false;
        }

        if(targetPile.list.length === 0){

            if(cardValue !== 1){
                return false;
            }

            return true;
        }

        const lastCardInTargetPile =
            targetPile.list[targetPile.length - 1];

        const targetVal =
            lastCardInTargetPile.getData("value");

        const targetSuit =
            lastCardInTargetPile.getData("suit");

        if(
            cardValue !== targetVal + 1 ||
            cardSuit !== targetSuit
        ){
            return false;
        }

        return true;
    }


    isCardValidToMoveToTableau(card, dropZone){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.tableauPile.cards[pileIndex];

        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];

        const numberOfCardsToMove =
            sourcePile.length - cardIndex;

        const cardValue =
            card.getData("value");

        const cardSuit =
            card.getData("suit");

        const cardColour =
            card.getData("colour");

        if(targetPile.list.length === 0){

            if(cardValue === 13){
                return true;
            }
        }
        else{

            const lastCardInTargetPile =
                targetPile.list[targetPile.length - 1];

            if(
                cardValue ===
                    lastCardInTargetPile.getData("value") - 1 &&
                cardColour !==
                    lastCardInTargetPile.getData("colour")
            ){

                for(let i = 0; i < numberOfCardsToMove; ++i){

                    const previousCardOnStack =
                        sourcePile.list[i + cardIndex];

                    const nextCardOnStack =
                        sourcePile.list[i + cardIndex + 1]
                            ? sourcePile.list[i + cardIndex + 1]
                            : null;

                    if(numberOfCardsToMove === 1){
                        return true;
                    }

                    if(nextCardOnStack === null){
                        return true;
                    }

                    if(
                        previousCardOnStack.getData("value") ===
                            nextCardOnStack.getData("value") - 1 &&
                        previousCardOnStack.getData("colour") !==
                            nextCardOnStack.getData("colour")
                    ){
                        return true;
                    }
                }
            }
        }

        return false;
    }


    handleMoveCardToTableau(card, dropZone){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.tableauPile.cards[pileIndex];

        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];

        const numberOfCardsToMove =
            sourcePile.length - cardIndex;

        let cardsToMove;

        const isValid =
            this.isCardValidToMoveToTableau(
                card,
                dropZone
            );

        if(!isValid){

            for(let i = 0; i < numberOfCardsToMove; ++i){

                cardsToMove =
                    sourcePile.list[i + cardIndex];

                cardsToMove.setPosition(
                    0,
                    cardsToMove.getData("cardIndex") * 40
                );

                cardsToMove.setData({
                    x: 0,
                    y: cardsToMove.getData("cardIndex") * 40
                });
            }

            return;
        }

        if(pileIndex === targetPileIndex){

            if(numberOfCardsToMove === 1){

                card.setPosition(
                    0,
                    cardIndex * 40
                );

                card.setData({
                    x: 0,
                    y: cardIndex * 40
                });

                return;
            }

            for(let i = 0; i < numberOfCardsToMove; ++i){

                cardsToMove =
                    sourcePile.list[i + cardIndex];

                cardsToMove.setPosition(
                    0,
                    cardsToMove.getData("cardIndex") * 40
                );

                cardsToMove.setData({
                    x: 0,
                    y: cardsToMove.getData("cardIndex") * 40
                });
            }

            return;
        }

        for(let i = 0; i < numberOfCardsToMove; ++i){

            const cardGameObject =
                this.scene.createCard(
                    "tableauPileCard",
                    0,
                    targetPile.length * 40
                ).setInteractive({
                    draggable: true
                });

            cardsToMove =
                sourcePile.list[i + cardIndex];

            cardGameObject.setFrame(
                cardsToMove.getData("frame")
            );

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

        for(let i = 0; i < numberOfCardsToMove; ++i){
            sourcePile.list.pop();
        }

        this.scene.solitaire.flipTopmostCardInTableau(
            sourcePile
        );

        return this;
    }


    handleMoveCardToDiscard(card, dropZone){
        this.handleMoveCardToEmptySpace(card);
    }


    handleMoveCardToDraw(card, dropZone){
        this.handleMoveCardToEmptySpace(card);
    }


    handleMoveCardToFoundation(card, dropZone){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.tableauPile.cards[pileIndex];

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.foundationPile.cards[targetPileIndex];

        const numberOfCardsToMove =
            sourcePile.length - cardIndex;

        let cardsToReturn;

        const isValid =
            this.isCardValidToMoveToFoundation(
                card,
                dropZone
            );

        if(!isValid){

            for(let i = 0; i < numberOfCardsToMove; ++i){

                cardsToReturn =
                    sourcePile.list[i + cardIndex];

                cardsToReturn.setPosition(
                    0,
                    cardsToReturn.getData("cardIndex") * 40
                );

                cardsToReturn.setData({
                    x: 0,
                    y: cardsToReturn.getData("cardIndex") * 40
                });
            }

            return;
        }

        if(cardIndex < sourcePile.length - 1){
            return;
        }

        const newCard =
            this.scene.createCard(
                "foundationPileCard",
                0,
                0
            );

        newCard.setData({
            frame: card.getData("frame"),
            value: card.getData("value"),
            suit: card.getData("suit"),
            colour: card.getData("colour"),
            x: targetPile.x,
            y: targetPile.y,
            pileIndex: targetPileIndex,
            cardIndex: targetPile.length
        });

        newCard
            .setInteractive({
                draggable: true
            })
            .setFrame(
                newCard.getData("frame")
            );

        targetPile.add(newCard);

        card.destroy();

        this.scene.solitaire.flipTopmostCardInTableau(
            sourcePile
        );

        return this;
    }


    showTopmostCardInTableau(targetPile){

        if(targetPile.list.length === 0){
            return;
        }

        const topmostCard =
            targetPile.list[
                targetPile.list.length - 1
            ];

        const cardFrame =
            topmostCard.getData("frame");

        topmostCard.setFrame(cardFrame);
    }


    hideTopmostCardInTableau(targetPile){

        const topmostCard =
            targetPile.list[
                targetPile.list.length - 1
            ];

        topmostCard &&
            topmostCard.setFrame(52);
    }
}