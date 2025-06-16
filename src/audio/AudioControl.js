class AudioControl{
    constructor(){
        
        this.playSong = new Audio("sounds/Fire_Crackling_Wind.wav");
        this.playSong.loop = true;
        
        this.buttonClickSound = new Audio("sounds/click.wav");
        this.beginGameSound = new Audio("sounds/begin_game.wav");
        this.drawSound = new Audio("sounds/draw.wav");
        this.dropSound = new Audio("sounds/drop.wav");
        this.errorSound = new Audio("sounds/error_sound.wav");
        this.undoSound = new Audio("sounds/undo.wav");
        this.shuffleSound = new Audio("sounds/shuffle.wav");
        
        this.songs = [this.playSong];
        this.sounds = [this.buttonClickSound, this.beginGameSound, this.drawSound, this.dropSound, this.errorSound, this.undoSound, this.shuffleSound];
        //REDUCE VOLUME AT STARTUP, UNLESS OTHERWISE SPECIFIED BY USER
        this.songs.forEach(song=>{song.volume = 0.2;});
        this.sounds.forEach(sound=>{sound.volume = 0.4;});
        this.errorSound.volume = 1;
    }
    
    play(audio){
        audio.currentTime = 0;
        audio.play();
    }
    
    stop(audio){
        audio.currentTime = 0;
        audio.pause();
    }
    stopAllSongs(){
        this.songs.forEach(song=>{
            song.currentTime = 0;
            song.pause();
        })
    }
    
}

export const audio = new AudioControl();