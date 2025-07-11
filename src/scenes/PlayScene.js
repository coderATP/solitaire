import { BaseScene } from "./BaseScene.js";
//command handler for card movements
//audio
import { AudioControl } from "../audio/AudioControl.js";
import { CommandHandler } from "../CommandHandler.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { UIEventsHandler } from "../events/UIEventsHandler.js";
import { Time } from "../events/Time.js";

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
        this.confirmText = document.getElementById("confirmText");
    }
    
    showInterface(){
        this.hideAllScreens();
        this.showOne(this.playScreen, "grid");
        this.showMultiple([this.playScreenBottomUI, this.playScreenTopUI], "flex", 0);
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
                            .setDepth(10).setAlpha(0.7)
                    }
                    
                }
            }
            else if(gameobject.name === "foundationPileCard"){
                const pile = this.solitaire.foundationPile.cards[gameobject.getData("pileIndex")];
                pile&& pile.setDepth(10);
                gameobject.setAlpha(0.7);
            }
            else if(gameobject.name === "discardPileCard"){
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
            //return if click on empty space
            if(!gameobject[0]) return;
            if(gameobject[0].name === "drawPileCard"){
                //audio
                //alert("clicking on a card")
                this.audio.play(this.audio.drawSound);
                const command = new DrawToDiscard(this, gameobject[0], null);
                this.commandHandler.execute(command);
            }
            else if(gameobject[0].name === "drawPileZone"){
                //audio
                //alert("clicking on a zone")
                const command = new DiscardToDraw(this, null, null);
                this.commandHandler.execute(command);
            }
        })
        //CSS EVENTS
        //SCREEN OVERLAY TROUBLESHOOTING
        this.screens.forEach(screen=>{
            screen.addEventListener("click", (e)=>{
                //alert(e.currentTarget.id)
            })
        })
        //PlayScene icons
        this.ui.playSceneIcons.forEach(icon=>{
            icon.addEventListener('click', (e)=>{
                if(e.currentTarget.id === "redo"){
                    if(this.commandHandler.undoneActions.length > 0){
                        this.audio.play(this.audio.undoSound);
                        this.commandHandler.redo();
                    }
                    else{
                        this.audio.play(this.audio.errorSound);
                        return;
                    }
                }
                else if(e.currentTarget.id === "undo"){
                    if(this.commandHandler.moves.length > 0){
                        this.audio.play(this.audio.undoSound);
                        this.commandHandler.undo();
                    }
                    else{
                        this.audio.play(this.audio.errorSound);
                        return;
                    } 
                }
                else if(e.currentTarget.id === "pause"){
                    eventEmitter.emit("PlayToPause");
                }
            })
        })
        this.processEvents();
        //this.handleGamePause();
        //this.handleGameComplete();
        return this;
    }
    
    processEvents(){
        const { PauseScene } = this.game.scene.keys;
        
        eventEmitter.on("PlayToPause", ()=>{
            //flags to avoid multiple event calling
            if(!this.scene.isPaused("PlayScene")){
                if(!PauseScene.gamePaused) this.scene.pause();
                this.audio.popUpSound.play();
                this.scene.launch("PauseScene");
                PauseScene.gamePaused = true;
            }
        })
        eventEmitter.on("PlayToGameComplete", ()=>{
            //PAUSE GAME
            if(!this.scene.isPaused("PlayScene")) this.scene.pause();
            this.watch.stopWatch();
            this.showOne(this.levelCompleteScreen, "grid", 0);
            this.audio.popUpSound.play();
            this.hideMultiple([this.playScreenBottomUI, this.playScreenTopUI]);
            //READ TIME REMAINING, MOVES AND SCORE
            this.solitaire.displayEndOfGameStatistics(); 
        })
        eventEmitter.once("PlayToTitle", ()=>{ this.scene.start("TitleScene")})
    }
    
    handleGameComplete(){
        //restart
        this.ui.levelComplete_replayBtn.addEventListener("click", ()=>{
            this.confirmText.innerText = "You've won! Replay?"
            this.trigger = "levelCompleteToRestart";
            this.audio.popUpSound.play();
            this.hide(this.levelCompleteScreen);
            this.show(this.confirmScreen, "grid").style.zIndex = 0;
            
            yesBtn.addEventListener('click', ()=>{
                this.ui.changeID(this.ui.pauseIcon, "pause"); //allow clicking again
                if(this.trigger !== "levelCompleteToRestart") return; 
                this.hide(this.confirmScreen);
                this.hide(this.levelCompleteScreen);
                if(this.gamePaused) this.scene.resume();
                this.watch.resetWatch(this.ui.timeText);
                this.watch.setUpWatch(this.ui.timeText);
                this.commandHandler.reset();
                this.solitaire.onClickRestartButton(); 
                this.updateMoves();
                this.updateScore();
            })
            noBtn.addEventListener('click', ()=>{
                if(this.trigger !== "levelCompleteToRestart") return;  
                this.hide(this.confirmScreen);
                this.show(this.levelCompleteScreen, "grid").style.zIndex = 0;
                this.audio.popUpSound.play();
            }) 
        })
        //new game
        this.ui.levelComplete_newGameBtn.addEventListener('click', ()=>{
            eventEmitter.emit("PlayToTitle");
        })
        //menu
        this.ui.levelComplete_menuBtn.addEventListener('click', ()=>{
            this.confirmText.innerText = "Return to Menu?"
            this.trigger = "levelCompleteToMenu";
            this.audio.popUpSound.play();
            this.hide(this.levelCompleteScreen);
            this.show(this.confirmScreen, "grid").style.zIndex = 0;
            
            yesBtn.addEventListener('click', ()=>{
                this.ui.changeID(this.ui.pauseIcon, "pause"); //allow clicking again
                if(this.trigger !== "levelCompleteToMenu") return;
                this.hide(this.confirmScreen);
                this.audio.beginGameSound.stop();
                this.audio.playSong.stop();
                this.watch.resetWatch(this.ui.timeText);
                this.scene.start("TitleScene"); 
            })
            noBtn.addEventListener('click', ()=>{
                if(this.trigger !== "levelCompleteToMenu") return; 
                this.hide(this.confirmScreen);
                this.show(this.levelCompleteScreen, "grid").style.zIndex = 0;
                this.audio.popUpSound.play();
                this.watch.stopWatch();
            }) 
        }) 
    }
    handleGamePause(){
        //resume
        pause_resumeBtn.addEventListener('click', ()=>{
            if(this.gamePaused) this.watch.resumeWatch(this.ui.timeText); 
            this.gamePaused = false; 
            this.scene.resume();
            this.audio.play(this.audio.buttonClickSound);
            this.ui.changeID(this.ui.pauseIcon, "pause"); //allow clicking again
            this.hide(this.pauseScreen);
        })
        //menu
        pause_menuBtn.addEventListener('click', ()=>{
            
            this.confirmText.innerText = "Return to Menu?"
            this.trigger = "pauseToMenu";
            this.audio.popUpSound.play();
            this.hide(this.pauseScreen);
            this.show(this.confirmScreen, "grid").style.zIndex = 0;
            
            yesBtn.addEventListener('click', ()=>{
                this.ui.changeID(this.ui.pauseIcon, "pause"); //allow clicking again
                if(this.trigger !== "pauseToMenu") return;
                this.hide(this.confirmScreen);
                this.audio.beginGameSound.stop();
                this.audio.playSong.stop();
                this.watch.resetWatch(this.ui.timeText);
                eventEmitter.emit("PlayToTitle");
            })
            noBtn.addEventListener('click', ()=>{
                if(this.trigger !== "pauseToMenu") return; 
                this.hide(this.confirmScreen);
                this.show(this.pauseScreen, "grid").style.zIndex = 0;
                this.audio.popUpSound.play();
                this.watch.stopWatch();
            }) 
        })
        //restart
        pause_restartBtn.addEventListener('click', ()=>{

            this.confirmText.innerText = "Restart?"
            this.trigger = "pauseToRestart";
            this.audio.popUpSound.play();
            this.hide(this.pauseScreen);
            this.show(this.confirmScreen, "grid").style.zIndex = 0;
            
            yesBtn.addEventListener('click', ()=>{
                this.ui.changeID(this.ui.pauseIcon, "pause"); //allow clicking again
                if(this.trigger !== "pauseToRestart") return; 
                this.hide(this.confirmScreen);
                this.hide(this.pauseScreen);
                if(this.gamePaused) this.scene.resume();
                this.watch.resetWatch(this.ui.timeText);
                this.watch.setUpWatch(this.ui.timeText);
                this.solitaire.onClickRestartButton();
            })
            noBtn.addEventListener('click', ()=>{
                if(this.trigger !== "pauseToRestart") return;  
                this.hide(this.confirmScreen);
                this.show(this.pauseScreen, "grid").style.zIndex = 0;
                this.audio.popUpSound.play();
            }) 
        })  
    }
    
    
    updateMoves(){
        this.ui.movesText.innerText = (this.commandHandler.totalMovesCount);
    }
    updateScore(){
        this.ui.scoreText.innerText = (this.commandHandler.movementScore);
    }
    create(){
        this.showOne(this.playScreen, "grid"); 
        this.camera = this.cameras.main;
        this.camera.fadeIn(2000);

        //audio
        this.audio = new AudioControl(this);

        //time
        this.watch = new Time(this);

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
        this.solitaire.update(time, delta);
    }
}