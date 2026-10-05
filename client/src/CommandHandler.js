import { eventEmitter } from "./events/EventEmitter.js";

export class CommandHandler {
    
    constructor(scene) {
        this.scene = scene;
        this.moves = [];
        this.totalMovesCount = 0;
        this.movementScore = 0;
    }
    
    getTotalMoves() { return this.totalMovesCount; }
    
    getMovementsScore() { return this.movementScore; }
    
    checkWin() {
        let hiddenTableauCards = 0;
        const { tableauPile } = this.scene.solitaire;
        
        tableauPile.cards.forEach(container => {
            container.list.forEach(card => {
                if (card.frame.name >= 52) hiddenTableauCards++;
            });
        });
        
        if (hiddenTableauCards === 0) {
            eventEmitter.emit("PlayToGameComplete");
        }
    }
    
    reset() {
        this.moves = [];
        this.totalMovesCount = 0;
        this.movementScore = 0;
    }
    
    execute(command) {
        command.execute();
        if (!command.isValid) return;
        this.totalMovesCount++;
        this.moves.push(command);
        this.lastAction = command.id;
    }
    
    undo() {
        if (this.moves.length === 0) return;
        const command = this.moves.pop();
        if (!command) return;
        command.undo();
        this.totalMovesCount++;
    }
}