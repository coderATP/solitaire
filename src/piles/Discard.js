export class DiscardPile extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        this.config = scene.config;
        //graphics
        this.graphics = scene.add.graphics({lineStyle: { width: 1, color: "0xffffff"}});
        
        scene.add.existing(this);
    }
    
    createCard(x, y, draggable = true){
        //card
        this.setOrigin(0)
            .setScale(this.config.zoomFactor)
            .setPosition(x, y)
            .setInteractive({draggable})
            .setVisible(true)
            .setData({x, y})
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
    
    handleDragEvent(){
        this.on("dragstart", (pointer, dragX, dragY)=>{
            
        })
        this.on("drag", (pointer, dragX, dragY)=>{
            this
                .setPosition(dragX, dragY)
                .setAlpha(0.8)
                .setDepth(1)
            
        })
        this.on("dragend", (pointer, dragX, dragY)=>{
            this
                .setDepth(0)
                .setAlpha(1)
                .setPosition(this.getData("x"), this.getData("y"))
            
        })  
        return this;
    }
    
}