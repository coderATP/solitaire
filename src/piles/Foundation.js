export class FoundationPile extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        this.config = scene.config;
        //graphics
        this.graphics = scene.add.graphics({lineStyle: { width: 1, color: "0xffffff"}});
        
        
        this.setOrigin(0)
            .setScale(this.config.zoomFactor)
            
        scene.add.existing(this);
    }
    
    createCard(x, y, draggable = true){
        this.setInteractive({draggable})
            .setVisible(true)
        this.setPosition(x, y) 
          
       
        //Rectangle area
        this.createPileRect(x, y);   
        return this;
    }
    
    createPileRect(x, y){
        this.rectangle = new Phaser.Geom.Rectangle(x, y, this.displayWidth, this.displayHeight); //rect 
        this.graphics.clear();
        //this.graphics.lineStyle(2, 0xff00ff);
        this.graphics.strokeRectShape(this.rectangle);
    }
    
}