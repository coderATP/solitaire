import { BaseScene } from "./BaseScene.js";
import { DrawPile } from "../piles/Draw.js";
import { DiscardPile } from "../piles/Discard.js";
import { FoundationPile } from "../piles/Foundation.js";
import { TableauPile } from "../piles/Tableau.js";


export class PlayScene extends BaseScene{
    constructor(config){
        super("PlayScene", config);
        this.config = config;
        
    }
    
    create(){
        const margin = 10;
        
        //draw pile
        this.drawPile = new DrawPile(this, 0, 0, "cards")
            .createCard(margin, 5, false); //draw pile
        //discard pile
        this.discardPile = new DiscardPile(this, 0, 0, "cards")
            .createCard(this.drawPile.x + this.drawPile.displayWidth + 20, this.drawPile.y, true) //discard pile
        //foundation pile
        this.foundationPiles = [];
        for(let i = 3; i >= 0; --i){
            let foundationPile = new FoundationPile(this, 0, 0, "cards")
            const padding = foundationPile.displayWidth + 10;
                foundationPile.createCard(this.config.width - ( (i* padding) + foundationPile.displayWidth) - margin, this.drawPile.y, false);
                
            this.foundationPiles.push(foundationPile);
        }
        //tableau piles
        this.tableauContainers = [];
        for(let i = 0; i < 7; ++i){
            //create 7 cards, 1 per pile
           // tableauPile.createCard(i* (padding + tableauPile.displayWidth) + marginLeft, this.drawPile.y + this.drawPile.displayHeight + 20, true);

            for(let j = 0; j < i+1; ++j){
                let tableauPile = new TableauPile(this, 0,0, "cards");
                const marginLeft = 100, marginRight = 100, marginTop = 40;
                
                const cardsWidthTotal = tableauPile.displayWidth*7;
                const availableWidthTotal = this.config.width - marginLeft - marginRight;
                const availablePaddingSpaceTotal = availableWidthTotal - cardsWidthTotal;
                
                const padding = availablePaddingSpaceTotal/6;
                
                //create 7 piles of cards, each pile having 1 more card than the previous 
                tableauPile.createCard(i* (padding + tableauPile.displayWidth) + marginLeft, this.drawPile.y + this.drawPile.displayHeight + marginTop+ j*20, true);
            }
        }
    }
}