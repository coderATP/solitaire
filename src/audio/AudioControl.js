export class AudioControl{
    constructor(scene){
        
        this.playSong = scene.sound.add('playSong');
        this.playSong.loop = true;
        
        this.buttonClickSound = scene.sound.add('buttonClickSound');
        this.beginGameSound = scene.sound.add('beginGameSound');
        this.drawSound = scene.sound.add('drawSound');
        this.dropSound = scene.sound.add('dropSound');
        this.errorSound = scene.sound.add('errorSound');
        this.undoSound = scene.sound.add('undoSound');
        this.shuffleSound = scene.sound.add('shuffleSound');
        this.popUpSound = scene.sound.add('popUpSound');
        this.songs = [this.playSong];
        this.sounds = [this.buttonClickSound, this.beginGameSound, this.drawSound, this.dropSound, this.errorSound, this.undoSound, this.shuffleSound, this.popUpSound];
        //REDUCE VOLUME AT STARTUP, UNLESS OTHERWISE SPECIFIED BY USER
        this.songs.forEach(song=>{song.volume = 0.2;});
        this.sounds.forEach(sound=>{sound.volume = 0.4;});
        this.errorSound.volume = 1;
        this.popUpSound.volume = 1;
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