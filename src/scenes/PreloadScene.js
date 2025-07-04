import { BaseScene } from "./BaseScene.js";

export class PreloadScene extends BaseScene{
    constructor(config) {
        super("BaseScene", config);
        this.config = config;
    }
    
    loadFiles(){
        this.load.audio('playSong', "sounds/overworld.ogg");
        this.load.image("clickToStart", "../images/clickToStart.png");
        this.load.image("title", "../images/title.png");
        this.load.spritesheet("cards", "../images/cards.png",
            {frameWidth: 88, frameHeight: 128});
        this.load.audio('buttonClickSound', 'sounds/click.wav');
        this.load.audio('beginGameSound', "sounds/begin_game.wav");
        this.load.audio('drawSound', "sounds/draw.wav");
        this.load.audio('dropSound', "sounds/drop.wav");
        this.load.audio('errorSound', "sounds/error_sound.wav");
        this.load.audio('undoSound', "sounds/undo.wav");
        this.load.audio('shuffleSound', "sounds/shuffle.wav");
    }
    
    preload(){
        this.registry.set('assetsTotal', 0);
        // track and display assets loading progress
        //added 1 new file
        this.load.on("addfile", ()=>{
            this.registry.inc("assetsTotal", 1);
        });

        this.loadingText = this.add.text(0,0, "", { font: "20px Arial"})
                .setOrigin(0)
                .setStyle({fill: 'white'})
        this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
        this.loadingText2 = this.add.text(0,0, "", { font: "20px Arial"})
                .setOrigin(0)
                .setStyle({fill: 'white'})
         
        //while files are still being added...
        this.load.on("progress", (progress)=>{
            this.loadingText.setText(Math.floor(progress*this.registry.get("assetsTotal")) + " of " + this.registry.get("assetsTotal") + " assets loading..." );
            this.loadingText2.setText("Please wait");
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
            this.loadingText2.setPosition(this.config.width/2 - this.loadingText2.width/2,  this.loadingText.y + this.loadingText.height+5);
        });
        
        //when file adding is done...
        this.load.on("complete", ()=>{
            //load animations (this has to wait till now since it requires textures to first load)
            //load animations here
            this.loadingText.setText("Ready? Let's Game!!");

            this.playSolitaire();

        })
        this.loadFiles(); 

    }
    toggleFullscreen(){
       if(!document.fullscreenElement){
           document.documentElement.requestFullscreen();
            screen.orientation.lock("landscape");
        }else if(document.exitFullscreen){
            document.exitFullscreen();
            screen.orientation.lock("landscape"); 
        }
    }  
    playSolitaire(){
        this.scene.start("TitleScene");
    }
    
    
}