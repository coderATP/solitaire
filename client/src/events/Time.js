export class Time{

    constructor(scene){
        this.scene = scene;
        const { PlayScene } = scene.game.scene.keys;
        this.playScene = PlayScene;
    }

    createTimeVariables(){
        this.min = 0;
        this.sec = 0;
        this.stopwatch = null;
        this.paused = true;
    }

    getTime(){
        const minutes =
            this.min < 10
                ? "0" + this.min
                : this.min;

        const seconds =
            this.sec < 10
                ? "0" + this.sec
                : this.sec;

        return minutes + ":" + seconds;
    }

    startWatch(){
        if(this.paused) return;

        this.sec += 1;

        if(this.sec > 59){
            this.sec = 0;
            this.min += 1;
        }

        if(this.playScene.ui){
            this.playScene.ui.setTime(
                this.getTime()
            );
        }
    }

    setUpWatch(){
        this.createTimeVariables();

        this.paused = false;

        this.stopwatch =
            setInterval(() => {
                this.startWatch();
            }, 1000);

        return this;
    }

    resumeWatch(){
        if(this.stopwatch) return;

        this.paused = false;

        this.stopwatch =
            setInterval(() => {
                this.startWatch();
            }, 1000);

        return this;
    }

    stopWatch(){
        clearInterval(this.stopwatch);
        this.stopwatch = null;
        this.paused = true;

        return this;
    }

    resetWatch(){
        clearInterval(this.stopwatch);

        this.stopwatch = null;
        this.createTimeVariables();

        if(this.playScene.ui){
            this.playScene.ui.setTime(
                "00:00"
            );
        }

        return this;
    }
}