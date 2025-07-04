import { BaseScene } from "./BaseScene.js";
//command handler for card movements
//audio
import { AudioControl } from "../audio/AudioControl.js";
import { CommandHandler } from "../CommandHandler.js";
import { eventEmitter } from "../events/EventEmitter.js";


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

        //TO-DO: move a card from draw-pile to discard-pile on clicking the draw-pile
        this.input.on("pointerdown", (pointer, gameobject)=>{
            //return if click on empty space
            if(!gameobject[0]) return;
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
            else if(gameobject[0].name === "undoButton"){
                //audio
                if(this.commandHandler.moves.length > 0) this.audio.play(this.audio.undoSound);
                this.commandHandler.undo();
            }
            else if(gameobject[0].name === "redoButton"){
                //audio
                if(this.commandHandler.undoneActions.length > 0) this.audio.play(this.audio.undoSound);
                this.commandHandler.redo();
            } 
            else if(gameobject[0].name === "newGameButton"){
                eventEmitter.emit("PlayToTitle");
            }
            else if(gameobject[0].name === "restartButton"){
                this.solitaire.onClickRestartButton();
            }
            else if(gameobject[0].name === "pauseButton"){
                eventEmitter.emit("PlayToPause");
            }  
        })
        eventEmitter.on("PlayToPause", ()=>{
            this.stopWatch();
            this.show(this.pauseScreen, "block");
        })
        eventEmitter.once("PlayToTitle", ()=>{
            //reset time and restart
            this.resetWatch();
            this.scene.restart();
        })
        this.playToPause();
        return this;
    }
    
    playToPause(){
        const confirmText = document.getElementById("confirmText"); 
        pause_resumeBtn.addEventListener('click', ()=>{
            this.audio.play(this.audio.buttonClickSound);
            this.hide(this.pauseScreen);
            this.resumeWatch();
        })
        pause_menuBtn.addEventListener('click', ()=>{
            confirmText.innerText = "Return to Menu?"
            this.trigger = "pauseToMenu";
            this.audio.play(this.audio.buttonClickSound);
            this.hide(this.pauseScreen);
            this.show(this.confirmScreen, "grid");
            yesBtn.addEventListener('click', ()=>{
                if(this.trigger !== "pauseToMenu") return;
                this.hide(this.confirmScreen);
                this.resetWatch();
                this.scene.start("TitleScene"); 
            })
            noBtn.addEventListener('click', ()=>{
                this.hide(this.confirmScreen);
                this.show(this.pauseScreen, "grid");
                this.stopWatch();
            }) 
        }) 
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
                this.hide(this.confirmScreen);
                this.show(this.pauseScreen, "grid");
            }) 
        })  
    }
    
    createBottomUI(){
        const width = this.config.width-10;
        const height = 40;
        const y = 10;
        this.graphics.fillStyle(0x000000, 2);
        this.graphics.fillRoundedRect(5, this.config.height-40-5, width, height,
            {tl: 10, tr: 10, bl: 0, br: 0});
        this.bottomUIRect = this.add.rectangle(5, this.config.height-40-5, width, height);
        this.bottomUIContainer = this.add.container(5, this.config.height-40-5); 
        //BUTTONS
        //restart-left
        this.restartButton = this.add.text(0,0, "Restart",
            {color: "green", fontFamily: "myOtherFont", fontSize: "20px"})
            .setOrigin(0)
            .setInteractive()
            .setName("restartButton");
        this.restartButton.setPosition(5, y); 
        this.restartRect = this.add.rectangle(this.restartButton.x, this.restartButton.y, this.restartButton.width, this.restartButton.height, 0xffffff, 1).setOrigin(0)
        //new game- right of restart
        this.newGameButton = this.add.text(0, 0, "New",
            {color: "green", fontFamily: "myOtherFont", fontSize: "20px"})
            .setOrigin(0)
            .setInteractive()
            .setName("newGameButton");
        this.newGameButton.setPosition(this.restartButton.x + this.restartButton.width + 5, y);
        this.newGameRect = this.add.rectangle(this.newGameButton.x, this.newGameButton.y, this.newGameButton.width, this.newGameButton.height, 0xffffff, 1).setOrigin(0);
        //pause- center
        this.pauseButton = this.add.text(0,0, "Pause",
            {color: "green", fontFamily: "myOtherFont", fontSize: "20px"})
            .setOrigin(0)
            .setInteractive()
            .setName("pauseButton");
        this.pauseButton.setPosition(width/2 - this.pauseButton.width/2, y); 
        this.pauseRect = this.add.rectangle(this.pauseButton.x, this.pauseButton.y, this.pauseButton.width, this.pauseButton.height, 0xffffff, 1).setOrigin(0);
        //undo-right
        this.undoButton = this.add.text(0, 0, "Undo",
            {color: "green", fontFamily: "myOtherFont", fontSize: "20px"})
            .setOrigin(0)
            .setInteractive()
            .setName("undoButton");
        this.undoButton.setPosition(width - this.undoButton.width-5, y);
        this.undoRect = this.add.rectangle(this.undoButton.x, this.undoButton.y, this.undoButton.width, this.undoButton.height, 0xffffff, 1).setOrigin(0)
       
        //redo- left of undo
        this.redoButton = this.add.text(0, 0, "Redo",
            {color: "green", fontFamily: "myOtherFont", fontSize: "20px"})
            .setOrigin(0)
            .setInteractive()
            .setName("redoButton");
        this.redoButton.setPosition(this.undoButton.x - this.undoButton.width-5, y);
        this.redoRect = this.add.rectangle(this.redoButton.x, this.redoButton.y, this.redoButton.width, this.redoButton.height, 0xffffff, 1).setOrigin(0)

        this.bottomUIContainer.add([this.restartRect, this.newGameRect, this.undoRect, this.redoRect, this.pauseRect, this.restartButton, this.newGameButton, this.undoButton, this.redoButton, this.pauseButton]);
        
        //tweens
        this.tweens.add({
            targets: this.restartButton,
            alpha: 0.3,
            yoyo: true,
            repeat: -1,
            duration: 1000,
            repeatDelay: 3000
        })
        this.tweens.add({
            targets: this.newGameButton,
            alpha: 0.3,
            yoyo: true,
            repeat: -1,
            duration: 1000,
            repeatDelay: 3000
        })
        this.tweens.add({
            targets: this.undoButton,
            alpha: 0.3,
            yoyo: true,
            repeat: -1,
            duration: 1000,
            repeatDelay: 3000
        })
    }
    
    createStatus(){
        this.statusTopRect = this.add.rectangle(5, 5, this.config.width-10, 30, 0x000000, 1, {radius: 10})
            .setOrigin(0);
        this.statusTopContainer = this.add.container(this.statusTopRect.x, this.statusTopRect.y); 

         //border
        this.graphics.lineStyle(7, 0x000000)
        this.graphics.strokeRect(0, 0, this.config.width, this.config.height, 0x000000, 1);
        
        //score status
        this.movementScoreText = this.add.text(5,5, "Score: ", {
            color: "gold", fontFamily: "myOtherFont", fontSize: "15px"
        })
        this.movementScore = this.add.text(this.movementScoreText.x+this.movementScoreText.width+2 , this.movementScoreText.y, "0", {
            color: "white", fontFamily: "myOtherFont", fontSize: "15px"
        })
        
        //time elapsed
        this.timeElapsed = this.add.text(0,0, "00:00", {
            color: "white", fontFamily: "myOtherFont", fontSize: "15px"
        })
        this.timeElapsed.setPosition(this.statusTopRect.width/2 - this.timeElapsed.width/2, 5);
        const timeText = this.add.text(0, 0, "Time: ", {
            color: "gold", fontFamily: "myOtherFont", fontSize: "15px"
        }) 
        timeText.setPosition(this.timeElapsed.x - timeText.width, 5);
       
        //moves taken 
        this.moves = this.add.text(0, 0, "0", {
            color: "white", fontFamily: "myOtherFont", fontSize: "15px"
        })
        this.moves.setPosition(this.statusTopRect.width-this.moves.width-5, 5);
        this.movesText = this.add.text(0,0, "Moves: ", {
            color: "gold", fontFamily: "myOtherFont", fontSize: "15px"
        }) 
        this.movesText.setPosition(this.moves.x-this.movesText.width, 5);
        
        this.statusTopContainer.add([this.movementScoreText, this.movementScore, this.movesText, this.moves, timeText, this.timeElapsed])
    }
    
    createTimeVariables(){
        this.min = 0;
        this.sec = 0;
        this.secText = undefined;
        this.minText = undefined;
        this.clockRunning = false;
    }
    startWatch(){
        this.sec+=1;
        if(this.sec > 59){
            this.sec = 0;
            this.min+=1;
        }
        if(this.sec < 10) this.secText = "0"+this.sec; else this.secText = this.sec;
        if(this.min < 10) this.minText = "0"+this.min; else this.minText = this.min;
        this.timeElapsed.setText(this.minText+":"+this.secText);
    }
    setUpWatch(){
        this.createTimeVariables();
        this.stopwatch = setInterval(()=>{
            this.startWatch();
            this.clockRunning = true;
        }, 1000);
    }
    resumeWatch(){
     //   this.clockRunning = false;
        this.stopwatch = setInterval(()=>{
            this.startWatch();
           // this.clockRunning = true;
        }, 1000);
    }
    stopWatch(){
        clearInterval(this.stopwatch);
        this.clockRunning = false;
    }
    resetWatch(){
        clearInterval(this.stopwatch);
        this.createTimeVariables();
        this.timeElapsed.setText("00:00"); 
        this.clockRunning = false;
    }
    updateMoves(){
        this.moves.setText(this.commandHandler.totalMovesCount);
        this.moves.setPosition(this.statusTopRect.width-this.moves.width-5, 5);
        this.movesText.setPosition(this.moves.x-this.movesText.width, 5);
    }
    updateScore(){
        this.movementScore.setText(this.commandHandler.movementScore);
    }
    create(){
        //audio
        this.audio = new AudioControl(this);
        this.audio.playSong.play();
        this.audio.beginGameSound.play();
 
        //time
        this.setUpWatch();
        //camera
        const camera = this.cameras.main;
        camera.fadeIn(1500);

        //graphics creation
        this.graphics = this.add.graphics({lineStyle:  {width: 1, color: "0xffffff"} })
        //solitaire
        this.solitaire = new Solitaire(this);
        
        this.solitaire.newGame();

        //events
       this.handleDragEvent().handleDropEvent().handleClickEvent();
       
       //statuses
       this.createStatus();
       //user-options ui
       this.createBottomUI();
       
    } 
    update(time, delta){
        this.updateMoves();
        this.updateScore();
        
    }
}