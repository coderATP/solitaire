import { BaseScene } from "./BaseScene.js";
//command handler for card movements
//audio
import { AudioControl } from "../audio/AudioControl.js";
import { CommandHandler } from "../CommandHandler.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { UIEventsHandler } from "../events/UIEventsHandler.js";


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
        
        this.ui = new UIEventsHandler(this);
        this.commandHandler = new CommandHandler(this);
 
    }
    
    showInterface(){
        this.show(this.playScreenTop, "flex");
        this.show(this.playScreenBottom, "flex"); 
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
                pile&& pile.setDepth(10);
                gameobject.setDepth(10).setAlpha(0.7);
            }

        })
        this.input.on("dragend", (pointer, gameobject, dropped)=>{
            gameobject.setDepth(0).setAlpha(1)
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
                pile.setDepth(0).setAlpha(1);
                gameobject.setDepth(0).setAlpha(1)
                if(cardIndex < pile.length - 1){
                    for(let i = 0; i < pile.length-cardIndex; ++i){
                        const card = pile.list[i+cardIndex];
                        card.setPosition(card.getData("x"), card.getData("y"))
                            .setDepth(0).setAlpha(1)
                    }
                }
                
                
            }
        })
        return this;
    }
    
    handleDropEvent(){
        this.input.on("drop", (pointer, gameobject, dropZone)=>{
           gameobject.setDepth(0).setAlpha(1)
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
        //PHASER EVENTS
        //TO-DO: move a card from draw-pile to discard-pile on clicking the draw-pile
        this.input.on("pointerdown", (pointer, gameobject)=>{
            //return if click on empty space or if game paused
            if(!gameobject[0] || this.gamePaused) return;
            if(gameobject[0].name === "drawPileCard"){
                //audio
                this.audio.play(this.audio.drawSound);
                const command = new DrawToDiscard(this, gameobject[0], null);
                this.commandHandler.execute(command);
            }
            else if(gameobject[0].name === "drawPileZone"){
                //audio
                const command = new DiscardToDraw(this, null, null);
                this.commandHandler.execute(command);
            }
        })
        //CSS EVENTS
        this.ui.playSceneIcons.forEach(icon=>{
            icon.addEventListener('click', (e)=>{
                
                if(e.target.id === "redoIcon"){
                    if(this.gamePaused) return;
                    if(this.commandHandler.undoneActions.length > 0){
                        this.audio.play(this.audio.undoSound);
                        this.commandHandler.redo();
                    }
                    else{
                        this.audio.play(this.audio.errorSound);
                        return;
                    }
                }
                else if(e.target.id === "undoIcon"){
                    if(this.gamePaused) return;
                    if(this.commandHandler.moves.length > 0){
                        this.audio.play(this.audio.undoSound);
                        this.commandHandler.undo();
                    }
                    else{
                        this.audio.play(this.audio.errorSound);
                        return;
                    } 
                }
                else if(e.target.id === "pauseIcon"){
                    eventEmitter.emit("PlayToPause");
                }
            })
        })
        eventEmitter.on("PlayToPause", ()=>{
            this.stopWatch();
            this.show(this.pauseScreen, "block");
            if(!this.gamePaused){
                this.scene.pause();
                this.gamePaused = true; 
            }

        })
        this.handleGamePause();
        return this;
    }
    
    handleGamePause(){
        const confirmText = document.getElementById("confirmText");
        this.gamePaused = true;
        //resume
        pause_resumeBtn.addEventListener('click', ()=>{
            this.scene.resume();
            this.gamePaused = false;
            this.audio.play(this.audio.buttonClickSound);
            this.hide(this.pauseScreen);
            this.resumeWatch(this.ui.timeText);
        })
        //menu
        pause_menuBtn.addEventListener('click', ()=>{
            confirmText.innerText = "Return to Menu?"
            this.trigger = "pauseToMenu";
            this.audio.play(this.audio.buttonClickSound);
            this.hide(this.pauseScreen);
            this.show(this.confirmScreen, "grid");
            yesBtn.addEventListener('click', ()=>{
                if(this.trigger !== "pauseToMenu") return;
                this.hide(this.confirmScreen);
                this.audio.beginGameSound.stop();
                this.audio.playSong.stop();
                this.resetWatch();
                this.scene.start("TitleScene"); 
            })
            noBtn.addEventListener('click', ()=>{
                this.gamePaused = false;
                this.hide(this.confirmScreen);
                this.show(this.pauseScreen, "grid");
                this.stopWatch();
            }) 
        })
        //restart
        pause_restartBtn.addEventListener('click', ()=>{
            confirmText.innerText = "Restart?"
            this.trigger = "pauseToRestart";
            this.audio.play(this.audio.buttonClickSound);
            this.hide(this.pauseScreen);
            this.show(this.confirmScreen, "grid");
            yesBtn.addEventListener('click', ()=>{
                if(this.trigger !== "pauseToRestart") return; 
                this.hide(this.confirmScreen);
                this.resetWatch();
                this.setUpWatch();
                this.solitaire.onClickRestartButton();
            })
            noBtn.addEventListener('click', ()=>{
                this.gamePaused = false;
                this.hide(this.confirmScreen);
                this.show(this.pauseScreen, "grid");
            }) 
        })  
    }
    
    createTimeVariables(){
        this.min = 0;
        this.sec = 0;
        this.secText = undefined;
        this.minText = undefined;
    }
    startWatch(renderer){
        this.sec+=1;
        if(this.sec > 59){
            this.sec = 0;
            this.min+=1;
        }
        if(this.sec < 10) this.secText = "0"+this.sec; else this.secText = this.sec;
        if(this.min < 10) this.minText = "0"+this.min; else this.minText = this.min;
        renderer.innerText = (this.minText+":"+this.secText);
    }
    setUpWatch(){
        this.createTimeVariables();
        this.stopwatch = setInterval(()=>{
            this.startWatch(this.ui.timeText);
        }, 1000);
    }
    resumeWatch(renderer){
        this.stopwatch = setInterval(()=>{
            this.startWatch(renderer);
        }, 1000);
    }
    stopWatch(){
        clearInterval(this.stopwatch);
    }
    resetWatch(){
        clearInterval(this.stopwatch);
        this.createTimeVariables();
        this.ui.timeText.innerText = "00:00"; 
    }
    updateMoves(){
        this.ui.movesText.innerText = (this.commandHandler.totalMovesCount);
    }
    updateScore(){
        this.ui.scoreText.innerText = (this.commandHandler.movementScore);
    }
    create(){
        this.showInterface();
        //camera
        this.camera = this.cameras.main;
        this.camera.fadeIn(1500);

        //audio
        this.audio = new AudioControl(this);
        this.audio.playSong.play();
        this.audio.beginGameSound.play();

        //time
        this.setUpWatch();

        //graphics creation
        this.graphics = this.add.graphics({lineStyle:  {width: 1, color: "0xffffff"} })
        
        //solitaire
        this.solitaire = new Solitaire(this);
        this.solitaire.newGame();

        //events
        this.handleDragEvent().handleDropEvent().handleClickEvent();
       
    } 
    update(time, delta){
        this.updateMoves();
        this.updateScore();
    }
}