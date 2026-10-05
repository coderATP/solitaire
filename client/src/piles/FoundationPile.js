export class FoundationPile {

    constructor(scene) {
    
    this.scene = scene;
    this.config = scene.config;
    this.graphics = scene.graphics;
    
    this.cards = [];
    this.dropZones = [];
    this.pileRects = [];
}


create() {
    
    this.cards = [];
    this.dropZones = [];
    this.pileRects = [];
    
    for (let i = 0; i < 4; ++i) {
        
        const container =
            this.scene.add.container(
                0,
                0
            );
        
        const rect =
            this.scene.createPileRect(
                0,
                0,
                1,
                1
            );
        
        const zone =
            this.scene.createDropZone(
                "foundationPileZone",
                0,
                0,
                1,
                1
            ).setData({
                pileIndex: i
            });
        
        
        this.cards.push(container);
        this.pileRects.push(rect);
        this.dropZones.push(zone);
    }
    
    return this;
}


    handleMoveCardToTableau(card, dropZone){

        const isValid =
            this.isCardValidToMoveToTableau(
                card,
                dropZone
            );

        if(!isValid){

            card.setPosition(
                0,
                0
            );

            return;
        }

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.foundationPile.cards[pileIndex];

        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];

        const newCard =
            this.scene.createCard(
                "tableauPileCard",
                0,
                targetPile.length * 20
            );

        newCard
            .setFrame(
                card.getData("frame")
            )
            .setInteractive({
                draggable: true
            })
            .setData({
                frame: card.getData("frame"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                colour: card.getData("colour"),
                x: newCard.x,
                y: newCard.y,
                pileIndex: targetPileIndex,
                cardIndex: targetPile.length
            });

        targetPile.add(newCard);

        card.destroy();

        return this;
    }


    handleMoveCardToEmptySpace(card){
        card.setPosition(0, 0);
    }


    handleMoveCardToDiscard(card){
        card.setPosition(0, 0);
    }


    handleMoveCardToDraw(card){
        card.setPosition(0, 0);
    }


    isCardValidToMoveToTableau(card, dropZone){

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];

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

            return false;
        }

        const lastCardInTargetPile =
    targetPile.list[targetPile.list.length - 1];

        if(
            cardValue ===
                lastCardInTargetPile.getData("value") - 1 &&
            cardColour !==
                lastCardInTargetPile.getData("colour")
        ){
            return true;
        }

        return false;
    }


    isCardValidToMoveToFoundation(card, dropZone){

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.foundationPile.cards[targetPileIndex];

        const cardValue =
            card.getData("value");

        const cardSuit =
            card.getData("suit");

        if(targetPile.list.length === 0){

            if(cardValue !== 1){
                return false;
            }
        }
        else{

            const lastCardInTargetPile =
    targetPile.list[targetPile.list.length - 1];

            if(
                cardValue !==
                    lastCardInTargetPile.getData("value") + 1 ||
                cardSuit !==
                    lastCardInTargetPile.getData("suit")
            ){
                return false;
            }
        }

        return true;
    }


    handleMoveCardToFoundation(card, dropZone){

        const isValid =
            this.isCardValidToMoveToFoundation(
                card,
                dropZone
            );

        if(!isValid){

            card.setPosition(
                0,
                0
            );

            return;
        }

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.foundationPile.cards[pileIndex];

        const targetPile =
            this.scene.solitaire.foundationPile.cards[targetPileIndex];

        if(pileIndex === targetPileIndex){

            card.setPosition(
                0,
                0
            );

            return;
        }

        if(targetPile.length !== 0){

            card.setPosition(
                0,
                0
            );

            return;
        }

        const newCard =
            this.scene.createCard(
                "foundationPileCard",
                0,
                0
            );

        newCard
            .setInteractive({
                draggable: true
            })
            .setFrame(
                card.getData("frame")
            )
            .setData({
                frame: card.getData("frame"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                colour: card.getData("colour"),
                x: targetPile.x,
                y: targetPile.y,
                pileIndex: targetPileIndex,
                cardIndex: targetPile.length
            });

        targetPile.add(newCard);

        card.destroy();

        return this;
    }
}