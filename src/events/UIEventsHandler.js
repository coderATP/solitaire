export class UIEventsHandler{
    constructor(scene){
        this.scene = scene;
        this.undoIcon = document.getElementById("undo");
        this.redoIcon = document.getElementById("redo");
        this.instructionsIcon = document.getElementById("instructions");
        this.settingsIcon = document.getElementById("settings");
        this.leaderboardIcon = document.getElementById("leaderboard");
        this.scoreIcon = document.getElementById("score");
        this.pauseIcon = document.getElementById("pause");
        this.hintIcon = document.getElementById("hint");
        this.movesIcon = document.getElementById("moves");
        this.timeIcon = document.getElementById("time");

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
    
    changeID(element, newID){
        element.id = newID;
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