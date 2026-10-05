export class DrawPile {
    
    constructor(scene) {
    
    this.scene = scene;
    this.config = scene.config;
    this.graphics = scene.graphics;
    
    this.cards = [];
    this.container = undefined;
    
    this.rect = null;
    this.zone = null;
}


create() {
    
    this.rect =
        this.scene.createPileRect(
            0,
            0,
            1,
            1
        );
    
    this.zone =
        this.scene.createDropZone(
            "drawPileZone",
            0,
            0,
            1,
            1
        );
    
    return this;
}
    
    
    updateTopmostTwoCardsPosition() {
    
    if (
        this.container &&
        this.container.list.length > 0
    ) {
        
        if (this.container.list[1]) {
            
            this.container.list[1].setPosition(
                -6,
                0
            );
        }
        
        if (this.container.list[2]) {
            
            this.container.list[2].setPosition(
                -3,
                0
            );
        }
    }
    
    
    this.updateZoneDepth();
}
    updateZoneDepth(){

    if(!this.zone){
        return;
    }


    if(
        this.container &&
        this.container.list.length === 0
    ){

        this.zone.setDepth(1);
    }
    else{

        this.zone.setDepth(-2);
    }
}
}