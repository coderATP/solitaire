import { DiscardToDrawAll} from "./movements/discard/DiscardToDraw.js";
import { DrawToDiscard } from "./movements/draw/DrawToDiscard.js";
import { DiscardToFoundation} from "./movements/discard/DiscardToFoundation.js";
import { FoundationToFoundation} from "./movements/foundation/FoundationToFoundation.js";
import { TableauToFoundation} from "./movements/tableau/TableauToFoundation.js";


export class CommandHandler{
    constructor(scene){
        this.scene = scene;
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
        this.lastAction = command.id;
    }
    
    undo(){
        if(this.movesToUndo === 0) return;
        const command = this.moves.pop();

        if(!command) return;
        console.log (command.id)
        if(command.id === "drawToDiscard"){
            new DrawToDiscard(this.scene, null, null).undo();
            this.movesToUndo--;
        }

        else if(command.id === "discardToDrawAll"){
            new DiscardToDrawAll(this.scene, null, null).undo();
            this.movesToUndo--;
        } 
        else if(command.id === "discardToFoundation"){
            new DiscardToFoundation(this.scene, null, null).undo(command);
            this.movesToUndo--; 
        }
        else if(command.id === "discardToTableau"){
            
        }
        else if(command.id === "foundationToFoundation"){
            new FoundationToFoundation(this.scene, null, null).undo(command);
            this.movesToUndo--;
        }
        else if(command.id === "tableauToFoundation"){
            new TableauToFoundation(this.scene, null, null).undo(command);
            this.movesToUndo--;
        } 
    
    }
}