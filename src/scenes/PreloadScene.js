import { BaseScene } from "./BaseScene.js";

export class PreloadScene extends BaseScene{
    constructor(config) {
        super("PreloadScene", config);
        this.config = config;
    }
    
    showInterface(){
        this.hideAllScreens();
        this.showOne(this.preloadScreen, "grid");
    }

    loadFiles(){
        let audioFileIndex = 0;
        this.text = "sounds";
        const audioFiles = [
            ['playSong', "sounds/menu.mp3"],
            ['buttonClickSound', 'sounds/click.wav'],
            ['beginGameSound', "sounds/begin_game.wav"],
            ['drawSound', "sounds/draw.wav"],
            ['dropSound', "sounds/drop.wav"],
            ['errorSound', "sounds/error_sound.wav"],
            ['undoSound', "sounds/undo.wav"],
            ['shuffleSound', "sounds/shuffle.wav"],
            ['popUpSound', "sounds/pop_up.ogg"],
        ]
        this.load.audio(...audioFiles[audioFileIndex]);
        this.load.on("filecomplete", ()=>{
                audioFileIndex++;
                if(audioFileIndex < audioFiles.length){
                    this.load.audio(...audioFiles[audioFileIndex]);
                }
                else{
                    this.text = "images";
                    this.load.image("clickToStart", "../images/clickToStart.png");
                    this.load.image("title", "../images/title.png");
                    this.load.spritesheet("cards", "../images/cards.png",
                        {frameWidth: 88, frameHeight: 128});
                }
            })

    }
    
    preload(){
        this.showInterface();
        this.registry.set('assetsTotal', 0);
        // track and display assets loading progress
        //added 1 new file
        this.load.on("addfile", ()=>{
            this.registry.inc("assetsTotal", 1);
        });

        this.loadingText = this.add.text(0,0, "", { font: "28px myFont"})
                .setOrigin(0)
                .setStyle({fill: 'white'})
        this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
        this.loadingText2 = this.add.text(0,0, "Please wait", { font: "28px myFont"})
                .setOrigin(0)
                .setStyle({fill: 'white'})
         
        //while files are still being added...
        this.load.on("progress", (progress)=>{
            this.loadingText.setText( "loading "+this.text + "..." );
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
            this.loadingText2.setPosition(this.config.width/2 - this.loadingText2.width/2,  this.loadingText.y + this.loadingText.height+5);
        });
        
        //when file adding is done...
        this.load.on("complete", ()=>{
            //load animations (this has to wait till now since it requires textures to first load)
            //load animations here
            this.loadingText2.destroy();
            this.loadingText2 = null;
            this.loadingText.setText("Click anywhere to start");
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
 
            this.input.once("pointerdown", ()=>{
                this.toggleFullscreen();
                setTimeout(()=>{this.scene.start("TitleScene")}, 500);
            }); 
        })
        this.loadFiles(); 

    }
        
    toggleFullscreen(){
        if(!document.fullscreenElement){
            //full screen
            document.documentElement.requestFullscreen();
            //portrait mode only
            if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('portrait').catch((error) => {
                        console.warn('Failed to lock screen orientation:', error);
                    });
                   // this.onResize();
                }
        }else if(document.exitFullscreen){
            document.exitFullscreen();
        }
    } 
    onResize(){
        window.addEventListener("resize", ()=>{
            this.config.width = screen.availWidth * devicePixelRatio;
            this.config.height = screen.availHeight * devicePixelRatio; 
        })
    } 
}