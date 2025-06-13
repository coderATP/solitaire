export class Movement{
    constructor(scene, card, dropZone){
        this.scene = scene;
        this.card = card;
        this.dropZone = dropZone;
        this.config = scene.config;
        this.graphics = scene.graphics;
    }
    
    execute(){}
    undo(){}
    redo(){}
}