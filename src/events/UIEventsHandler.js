export class UIEventsHandler{
    constructor(scene){
        this.scene = scene;
        this.undoIcon = document.getElementById("undoIcon");
        this.redoIcon = document.getElementById("redoIcon");
        this.instructionsIcon = document.getElementById("instructionsIcon");
        this.settingsIcon = document.getElementById("settingsIcon");
        this.leaderboardIcon = document.getElementById("leaderboardIcon");
        this.scoreIcon = document.getElementById("scoreIcon");
        this.pauseIcon = document.getElementById("pauseIcon");
        this.hintIcon = document.getElementById("hintIcon");
        this.movesIcon = document.getElementById("movesIcon");
        this.timeIcon = document.getElementById("timeIcon");

        this.playSceneIcons = [this.undoIcon, this.redoIcon, this.instructionsIcon, this.settingsIcon, this.leaderboardIcon, this.hintIcon, this.pauseIcon];
        
        //texts
        this.undoText = document.getElementById("undoText");
        this.redoText = document.getElementById("redoText");
        this.instructionsText = document.getElementById("instructionsText");
        this.settingsText = document.getElementById("settingsText");
        this.leaderboardText = document.getElementById("leaderboardText");
        this.scoreText = document.getElementById("scoreText");
        this.pauseText = document.getElementById("pauseText");
        this.hintText = document.getElementById("hintText");
        this.movesText = document.getElementById("movesText");
        this.timeText = document.getElementById("timeText");
        
        this.addClickSound();
    }
    
    addClickSound(){
        this.playSceneIcons.forEach(icon=>{
            icon.addEventListener('click', (e)=>{
                if(e.target.id !== "undoIcon" && e.target.id !== "redoIcon")
                this.scene.audio.play(this.scene.audio.buttonClickSound);
            })
        })
    }
    
}