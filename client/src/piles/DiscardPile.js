export class DiscardPile {

    constructor(scene) {
    
    this.scene = scene;
    this.config = scene.config;
    this.graphics = scene.graphics;
    
    this.cards = [];
    
    this.rect = null;
    this.zone = null;
    this.container = null;
}


create() {
    
    this.rect =
        this.scene.createPileRect(
            0,
            0,
            1,
            1
        );
    
    this.zone =
        this.scene.createDropZone(
            "discardPileZone",
            0,
            0,
            1,
            1
        );
    
    this.container =
        this.scene.add.container(
            0,
            0
        );
    
    this.cards.push(
        this.container
    );
    
    return this;
}


    handleMoveCardToEmptySpace(card){

        card.setPosition(
            card.getData("x"),
            card.getData("y")
        );
    }


    handleMoveCardToDraw(card){

        card.setPosition(
            card.getData("x"),
            card.getData("y")
        );
    }


    handleMoveCardToDiscard(card){

        card.setPosition(
            card.getData(
                card.getData("x")
            ),
            card.getData("y")
        );
    }


    handleMoveCardToFoundation(card, dropZone){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const sourcePile =
            this.scene.solitaire.foundationPile.cards[pileIndex];

        const targetPile =
            this.scene.solitaire.foundationPile.cards[targetPileIndex];

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

        if(pileIndex === targetPileIndex){
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
                x: newCard.x,
                y: newCard.y,
                pileIndex: targetPileIndex,
                cardIndex: targetPile.length
            });

        targetPile.add(newCard);

        card.destroy();

        return this;
    }


    handleMoveCardToTableau(card, dropZone){

        const cardIndex =
            card.getData("cardIndex");

        const pileIndex =
            card.getData("pileIndex");

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];

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


    isCardValidToFoundation(card, dropZone){

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.foundationPile.cards[targetPileIndex];

        const cardValue =
            card.getData("value");

        const cardSuit =
            card.getData("suit");

        if(targetPile.list.length === 0){

            return cardValue === 1;
        }

        const lastCardInTargetPile =
            targetPile.list[targetPile.length - 1];

        return (
            cardValue ===
                lastCardInTargetPile.getData("value") + 1 &&
            cardSuit ===
                lastCardInTargetPile.getData("suit")
        );
    }


    isCardValidToMoveToFoundation(card, dropZone){

        return this.isCardValidToFoundation(
            card,
            dropZone
        );
    }


    isCardValidToMoveToTableau(card, dropZone){

        const targetPileIndex =
            dropZone.getData("pileIndex");

        const targetPile =
            this.scene.solitaire.tableauPile.cards[targetPileIndex];

        const cardValue =
            card.getData("value");

        const cardColour =
            card.getData("colour");

        if(targetPile.list.length === 0){
            return cardValue === 13;
        }

        const lastCardInTargetPile =
            targetPile.list[targetPile.length - 1];

        return (
            cardValue ===
                lastCardInTargetPile.getData("value") - 1 &&
            cardColour !==
                lastCardInTargetPile.getData("colour")
        );
    }


    returnToDrawPile(){

        const drawPile =
            this.scene.solitaire.drawPile;

        if(drawPile.container.length > 0){
            return;
        }

        for(
            let i = 0;
            i < this.container.length;
            ++i
        ){

            const card =
                this.container.list[i];

            const newCard =
                this.scene.createCard(
                    "drawPileCard",
                    0,
                    0
                );

            newCard
                .setFrame(52)
                .setInteractive({
                    draggable: false
                })
                .setDepth(5)
                .setData({
                    frame: card.getData("frame"),
                    value: card.getData("value"),
                    suit: card.getData("suit"),
                    colour: card.getData("colour"),
                    x: newCard.x,
                    y: newCard.y
                });

            drawPile.container.add(
                newCard
            );
        }

        this.container.list = [];

        drawPile.container.list.reverse();

        drawPile.zone.setDepth(-1);

        return this;
    }
}