export class TableauPile extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);
        this.scene = scene;
        this.config = scene.config;
        //graphics
        this.graphics = scene.add.graphics({lineStyle: { width: 1, color: "0xffffff"}});
        this.containers = [];
        
        this.setOrigin(0)
            .setScale(this.config.zoomFactor)
            
        scene.add.existing(this);
    }
    
    createCard(x, y, draggable, cardIndex, pileIndex){
        this.setInteractive({draggable})
            .setVisible(true)
            .setFrame(3*18)
            .setPosition(x, y)
            .setData({x,y, cardIndex, pileIndex})
          
       
        //Rectangle area
        this.createPileRect(x, y);
        this.handleDragEvent()
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
                .setAlpha(0.8)
            const cardIndex = this.getData("cardIndex")
            const pileIndex = this.getData("pileIndex")
            this.scene.tableauPiles[pileIndex].setDepth(1).setAlpha(0.8)
            
            const containerLength = this.scene.tableauPiles[pileIndex].length - 1;
            if(cardIndex < containerLength){
                for(let i = cardIndex; i <= containerLength; ++i){
                    const card = this.scene.tableauPiles[pileIndex].list[i];
                    card.setPosition(dragX, dragY+ i*20);
                }
            }
            //we're trying to move just the last index card
            else{
                this.setPosition(dragX, dragY);
            } 
        })
        
        this.on("dragend", (pointer, dragX, dragY)=>{
            
            const cardIndex = this.getData("cardIndex")
            const pileIndex = this.getData("pileIndex")
            this.scene.tableauPiles[pileIndex].setDepth(0).setAlpha(1)
            
            const containerLength = this.scene.tableauPiles[pileIndex].length - 1;
            if(cardIndex < containerLength){
                for(let i = cardIndex; i <= containerLength; ++i){
                    const card = this.scene.tableauPiles[pileIndex].list[i];
                    card.setPosition(card.getData("x"), card.getData("y"));
                }
            }
            //we're trying to move just the last index card
            else{
                this.setPosition(this.getData("x"), this.getData("y"));
            }
        })
        return this;
    } 
    
}