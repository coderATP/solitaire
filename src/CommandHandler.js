import { DrawToDiscard } from "./movements/draw/DrawToDiscard.js";

import { DiscardToDraw} from "./movements/discard/DiscardToDraw.js";
import { DiscardToFoundation} from "./movements/discard/DiscardToFoundation.js";
import { DiscardToTableau } from "./movements/discard/DiscardToTableau.js";

import { FoundationToFoundation} from "./movements/foundation/FoundationToFoundation.js";
import { FoundationToTableau } from "./movements/foundation/FoundationToTableau.js";

import { TableauToFoundation} from "./movements/tableau/TableauToFoundation.js";
import { TableauToTableau} from "./movements/tableau/TableauToTableau.js";


export class CommandHandler{
    constructor(scene){
        this.scene = scene;
        //tracking undo and redo actions 
        this.moves = [];
        this.totalMoves = 0;
        this.movesToRedo = 0;
        this.movesToUndo = 0;
    }
    
    reset(){
        this.moves = [];
        this.totalMoves = 0;
        this.movesToRedo = 0;
        this.movesToUndo = 0; 
    }
    execute(command){
        command.execute();
        if(!command.isValid) return;
        this.moves.push(command);
        this.movesToUndo++;
        this.movesToRedo = 0;
        this.lastAction = command.id;
    }
    
    undo(){
        if(this.movesToUndo === 0) return;
        if(this.moves.length === 0) return;
        const command = this.moves.pop();

        if(!command) return;
        if(command.id === "drawToDiscard"){
            new DrawToDiscard(this.scene, null, null).undo();
            this.movesToUndo--;
        }

        else if(command.id === "discardToDraw"){
            new DiscardToDraw(this.scene, null, null).undo();
            this.movesToUndo--;
        } 
        else if(command.id === "discardToFoundation"){
            new DiscardToFoundation(this.scene, null, null).undo(command);
            this.movesToUndo--; 
        }
        else if(command.id === "discardToTableau"){
            new DiscardToTableau(this.scene, null, null).undo(command);
            this.movesToUndo--;  
        }
        else if(command.id === "foundationToFoundation"){
            new FoundationToFoundation(this.scene, null, null).undo(command);
            this.movesToUndo--;
        }
        else if(command.id === "foundationToTableau"){
            new FoundationToTableau(this.scene, null, null).undo(command);
            this.movesToUndo--;
        } 
        else if(command.id === "tableauToFoundation"){
            new TableauToFoundation(this.scene, null, null).undo(command);
            this.movesToUndo--;
        }
        else if(command.id === "tableauToTableau"){
            new TableauToTableau(this.scene, null, null).undo(command);
            this.movesToUndo--;
        }
    
    }
}