export class CommandHandler{
    constructor(){
        //tracking undo and redo actions 
        this.moves = [];
        this.totalMoves = 0;
        this.movesToRedo = 0;
        this.movesToUndo = 0;
    }
    
    execute(command){
        command.execute();
        this.moves.push(command);
        this.movesToUndo++;
        this.movesToRedo = 0; 
    }
    
    undo(){
        if(this.movesToUndo === 0) return;
        const command = this.moves.pop();
        if(!command) return;
        command.undo();
        this.movesToUndo--;
        this.movesToRedo++; 
    }
    
    redo(command){
        if(this.movesToRedo === 0) return;
        command.redo();
        this.moves.push(command);
        this.movesToUndo++;
        this.movesToRedo--; 
    }
}