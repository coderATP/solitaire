import { BaseScene } from "./BaseScene.js";
//command handler for card movements
import { CommandHandler } from "../CommandHandler.js";

//card movements
import { DrawToDiscard } from "../movements/draw/DrawToDiscard.js";
import { DiscardToDraw } from "../movements/discard/DiscardToDraw.js";
import { DiscardToFoundation } from "../movements/discard/DiscardToFoundation.js";
import { DiscardToTableau } from "../movements/discard/DiscardToTableau.js";
import { FoundationToFoundation } from "../movements/foundation/FoundationToFoundation.js";
import { FoundationToTableau } from "../movements/foundation/FoundationToTableau.js";
import { TableauToFoundation } from "../movements/tableau/TableauToFoundation.js";
import { TableauToTableau } from "../movements/tableau/TableauToTableau.js";
import { Solitaire } from "../Solitaire.js";


export class PlayScene extends BaseScene{
    constructor(config){
        super("PlayScene", config);
        this.config = config;
        this.commandHandler = new CommandHandler(this);
    }
    
    createCard(type, x, y){
        const card =  this.add.image(x,y,"cards").setName(type).setOrigin(0).setScale(this.config.zoomFactor);
        return card
    }
    createPileRect(x, y, w, h){
        const rect = new Phaser.Geom.Rectangle(x, y, w, h);
        this.graphics.strokeRectShape(rect);
        return rect;
    }
    createDropZone(zoneType, x, y, w, h){
        const zone = this.add.zone(x, y, w, h).setRectangleDropZone(w+30, h+30).setDepth(-2)
        .setName(zoneType).setOrigin(0);
        if(this.config.debug){
            this.add.rectangle(x, y, w, h, 0x09144ff, 0.0).setDepth(200).setOrigin(0);
        }
        return zone;
    }
    
    handleDragEvent(){
        this.input.on("drag", (pointer, gameobject, dragX, dragY)=>{
            //change position for a single card
            gameobject.setPosition(dragX, dragY);
            //change position for a stack of cards from tableau 
            if(gameobject.name === "tableauPileCard"){
                gameobject.setPosition(dragX, dragY)
                const pileIndex = gameobject.getData("pileIndex");
                const cardIndex = gameobject.getData("cardIndex");
                
                const pile = this.solitaire.tableauPile.cards[pileIndex];
                pile.setDepth(10);
                if(cardIndex < pile.length - 1){
                    for(let i = 0; i < pile.length-cardIndex; ++i){
                        const card = pile.list[i+cardIndex];
                        card.setPosition(dragX, dragY+i*20)
                            .setDepth(10).setAlpha(0.8)
                    }
                    
                }
            }
            else if(gameobject.name === "foundationPileCard"){
                const pile = this.solitaire.foundationPile.cards[gameobject.getData("pileIndex")];
                pile.setDepth(10);
                gameobject.setDepth(10).setAlpha(0.7);
            }
            else if(gameobject.name === "discardPileCard"){
                const pile = this.solitaire.discardPile.cards[0];
                pile.setDepth(10);
                gameobject.setDepth(10).setAlpha(0.7);
            }

        })
        this.input.on("dragend", (pointer, gameobject, dropped)=>{
          //  gameobject.setPosition(gameobject.getData("x"), gameobject.getData("y")); 
           //for invalid moves, snap back to original location
            if(gameobject.name === "foundationPileCard"){
                if(!dropped)
                    this.solitaire.foundationPile.handleMoveCardToEmptySpace(gameobject);
                    return;
            }
            else if(gameobject.name === "discardPileCard"){
                if(!dropped)
                    this.solitaire.discardPile.handleMoveCardToEmptySpace(gameobject);
                    return;
            } 
            else if(gameobject.name === "tableauPileCard"){
                if(!dropped){
                    this.solitaire.tableauPile.handleMoveCardToEmptySpace(gameobject);
                    return;
                }
                const pileIndex = gameobject.getData("pileIndex");
                const cardIndex = gameobject.getData("cardIndex");
                
                const pile = this.solitaire.tableauPile.cards[pileIndex];
                pile.setDepth(0);
                gameobject.setDepth(0)
                if(cardIndex < pile.length - 1){
                    for(let i = 0; i < pile.length-cardIndex; ++i){
                        const card = pile.list[i+cardIndex];
                        card.setPosition(card.getData("x"), card.getData("y"))
                            .setDepth(0)
                    }
                }
                
                
            }
        })
        return this;
    }
    
    handleDropEvent(){
        this.input.on("drop", (pointer, gameobject, dropZone)=>{
           gameobject.setDepth(0).setAlpha(1);
            switch(dropZone.name){
                //FOUNDATION DROP ZONE
                case "foundationPileZone":{
                    //discard to foundation
                    if(gameobject.name === "discardPileCard"){
                        const command = new DiscardToFoundation(this, gameobject, dropZone);
                        this.commandHandler.execute(command);
                      // this.solitaire.discardPile.handleMoveCardToFoundation(gameobject, dropZone)
                    }
                    //tableau to foundation
                    else if(gameobject.name === "tableauPileCard"){
                        const command = new TableauToFoundation(this, gameobject, dropZone);
                        this.commandHandler.execute(command);
                       //this.solitaire.tableauPile.handleMoveCardToFoundation(gameobject, dropZone)
                    }
                    //foundation to foundation
                    else if(gameobject.name === "foundationPileCard"){
                        const command = new FoundationToFoundation(this, gameobject, dropZone);
                        this.commandHandler.execute(command);
                       //this.solitaire.foundationPile.handleMoveCardToFoundation(gameobject, dropZone)
                    }  
                break;
                }
                //TABLEAU DROP ZONE
                case "tableauPileZone":{
                    //discard to tableau 
                    if(gameobject.name === "discardPileCard"){
                        const command = new DiscardToTableau(this, gameobject, dropZone);
                        this.commandHandler.execute(command);
                       //this.solitaire.discardPile.handleMoveCardToTableau(gameobject, dropZone)
                    }
                    //tableau to tableau
                    else if(gameobject.name === "tableauPileCard"){
                        const command = new TableauToTableau(this, gameobject, dropZone);
                        this.commandHandler.execute(command);
                      // this.solitaire.tableauPile.handleMoveCardToTableau(gameobject, dropZone)
                    }
                    //foundation to tableau
                    else if(gameobject.name === "foundationPileCard"){
                        const command = new FoundationToTableau(this, gameobject, dropZone);
                        this.commandHandler.execute(command);
                      // this.solitaire.foundationPile.handleMoveCardToTableau(gameobject, dropZone)
                    }
                break;
                }
                //DISCARD PILE ZONE
                case "discardPileZone":{
                    //tableau to discard
                    if(gameobject.name === "tableauPileCard"){
                        this.solitaire.tableauPile.handleMoveCardToDiscard(gameobject, dropZone);
                    }
                    //foundation to discard
                    else if(gameobject.name === "foundationPileCard"){
                        this.solitaire.foundationPile.handleMoveCardToDiscard(gameobject, );
                    }
                    //discard going to discardxxxx
                    else if(gameobject.name === "discardPileCard"){
                        this.solitaire.discardPile.handleMoveCardToDiscard(gameobject, );
                    }  
                break;
                }
                case "drawPileZone":{
                    if(gameobject.name === "tableauPileCard"){
                        this.solitaire.tableauPile.handleMoveCardToDraw(gameobject, dropZone);
                    }
                    else if(gameobject.name === "foundationPileCard"){
                        this.solitaire.foundationPile.handleMoveCardToDraw(gameobject, );
                    }
                    else if(gameobject.name === "discardPileCard"){
                        this.solitaire.discardPile.handleMoveCardToDraw(gameobject, );
                    }  
                break;
                } 
            }
        })
        return this;
    }
    
    handleClickEvent(){
        const drawPile = this.solitaire.drawPile;

        //TO-DO: move a card from draw-pile to discard-pile on clicking the draw-pile
        this.input.on("pointerdown", (pointer, gameobject)=>{
            //return if click on empty space
            if(!gameobject[0]) return;
            if(gameobject[0].name === "drawPileCard"){
                const command = new DrawToDiscard(this, gameobject[0], null);
                this.commandHandler.execute(command);
            }
            else if(gameobject[0].name === "drawPileZone"){
                const command = new DiscardToDraw(this, null, null);
                this.commandHandler.execute(command);
                //this.solitaire.discardPile.returnToDrawPile();
            }
            else if(gameobject[0].name === "undoButton"){
                this.commandHandler.undo();
            }
        })
        return this;
    }
    
    create(){
        //buttons
        this.undoButton = this.add.text(0,0, "undo",
            {font: "30px Arial"})
            .setOrigin(0)
            .setInteractive()
            .setName("undoButton");
        //graphics creation
        this.graphics = this.add.graphics({lineStyle:  {width: 1, color: "0xffffff"} })
        //solitaire
        this.solitaire = new Solitaire(this);
        this.solitaire.newGame();

        //events
       this.handleDragEvent().handleDropEvent().handleClickEvent();
    }
    update(time, delta){

    }
}