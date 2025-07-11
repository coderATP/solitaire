export class Time{
    constructor(scene){
        this.scene = scene;
    }
    
    createTimeVariables(){
        this.min = 0;
        this.sec = 0;
        this.secText = undefined;
        this.minText = undefined;
        this.paused = true;
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
        this.paused = false;
        return this;
    }
    setUpWatch(renderer){
        this.createTimeVariables();
        this.stopwatch = setInterval(()=>{
            this.startWatch(renderer);
        }, 1000);
        return this;
    }
    resumeWatch(renderer){
        this.stopwatch = setInterval(()=>{
            this.startWatch(renderer);
        }, 1000);
    }
    stopWatch(){
        clearInterval(this.stopwatch);
        this.paused = true;
        return this;
    }
    resetWatch(renderer){
        clearInterval(this.stopwatch);
        this.createTimeVariables();
        renderer.innerText = "00:00"; 
        this.paused = true;
        return this;
    }
    
    getRemainingTime(){
        const totalTime = 600; //seconds
        const timeElapsed = (this.min*60) + this.sec;
        return timeElapsed < totalTime ? totalTime - timeElapsed : 0;
        return this;
    }
}