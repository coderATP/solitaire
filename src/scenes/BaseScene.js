export class BaseScene extends Phaser.Scene{
    constructor(scene){
        super(scene);
        
        this.scene = scene;
        this.config = undefined;
    }
    
    
}