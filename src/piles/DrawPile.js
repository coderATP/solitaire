export class DrawPile{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.cards = [];
        this.container = undefined;
    }
    
    create(){
       
       //pile rectangle 
       this.rect = this.scene.createPileRect(this.getBiodata().x, this.getBiodata().y, this.getBiodata().displayWidth, this.getBiodata().displayHeight);
       //drop zone
       this.zone = this.scene.createDropZone("drawPileZone", this.getBiodata().x, this.getBiodata().y, this.getBiodata().displayWidth, this.getBiodata().displayHeight);
       
       return this;
    }
    
    getBiodata(){
        return{x: 10, y: 50, displayWidth: 37, displayHeight: 52};
    }
    
    updateTopmostTwoCardsPosition(){
        if(this.container.list.length > 0){
            if(this.container.list[1]){
                this.container.list[1].setPosition(-6,0);
            }
            if(this.container.list[2]){
                this.container.list[2].setPosition(-3,0);
            } 
            
        }
    }
}