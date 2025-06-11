import { DrawPile } from "../piles/DrawPile.js";
import { DiscardPile } from "../piles/DiscardPile.js";
import { FoundationPile } from "../piles/FoundationPile.js";
import { TableauPile } from "../piles/TableauPile.js";


export class Solitaire{
    static CARD_BACK_FRAMES = [52, 53, 54, 55, 56];
    static CARD_VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    static CARD_START_FRAMES = {
        CLUB: 0,
        DIAMOND: 13,
        HEART: 26,
        SPADE: 39
    }
    static CARD_COLOURS = {
        CLUB: "BLACK",
        DIAMOND: "RED",
        HEART: "RED",
        SPADE: "BLACK"
    } 
    static CARD_SUITS = ["CLUB", "DIAMOND", "HEART", "SPADE"];
    constructor(scene){
        this.scene = scene;
        this.drawPile = new DrawPile(scene).create();
        this.discardPile = new DiscardPile(scene).create();
        this.foundationPile = new FoundationPile(scene).create();
        this.tableauPile = new TableauPile(scene).create();
        
        this.deck = [];
    }
    createDeck(){
        for(let i = 0; i < Solitaire.CARD_SUITS.length; ++i ){
            
            const startFrame = Object.values(Solitaire.CARD_START_FRAMES)[i];
            for(let j = 0; j < 13; ++j){
               const card = this.scene.createCard("null", 0, 0)
                   .setOrigin(0)
                   .setFrame(52)
                   .setDepth(0)
                   .setData({
                       frame: startFrame + j,
                       value: j+1,
                       suit: Solitaire.CARD_SUITS[i],
                       colour: Object.values(Solitaire.CARD_COLOURS)[i]
                   })
               this.deck.push(card);
            }
        }
    }
    
    shuffleDeck(){
        //shuffle card deck
        let tempDeck = [];
        while(this.deck.length){
            const randomPos = Math.floor(Math.random() * this.deck.length);
            const randomCard = (this.deck.splice(randomPos, 1))[0];
            tempDeck.push(randomCard);
        }
        this.deck = tempDeck;
        tempDeck = [];
    }
    
    distributeDeckCardsToPiles(){
        const tempDeck = this.deck;
        //TO-DO: remove 24 cards from deck and place them into draw-pile
        this.drawPileData = this.drawPile.getBiodata();
        
        let tempDrawPile = tempDeck.splice(0, 24);
        
        for(let i = 0; i < 24; ++i){
            const tempCard = tempDrawPile[i];
            const card = this.scene.createCard("drawPileCard", 0, 0)
                .setDepth(0)
                .setFrame(52)
                .setInteractive({draggable: false})
            card.setData({
                frame: tempCard.getData("frame"),
                colour: tempCard.getData("colour"),
                value: tempCard.getData("value"),
                suit: tempCard.getData("suit")
            });
            card.setData({x: card.x, y: card.y})
           
            this.drawPile.container.add(card);
            tempDrawPile[i].destroy();
        }
        
        //TO-DO: distribute remaining 28 cards from deck onto the tableau piles
        //logic: move 1 card into the 1st container, 2 cards into the 2nd container, 3 cards into the third...
        //using the array.splice() function.
        this.tableauData = this.tableauPile.getBioData();
        
        for(let i = 0; i < 7; ++i){
            const container = this.scene.add.container(this.tableauData.marginLeft + i* (this.tableauData.padding+this.tableauData.displayWidth), this.tableauData.marginTop); 
            for(let j = 0; j < i+1; ++j){
                container.add(tempDeck.splice(j, 1))
            }
            this.tableauPile.cards.push(container);
        }
        //...the code above eventually leaves 4 more cards in the deck,
        //so they are added to the last pile as shown in the forEach() method below:->
        tempDeck.forEach(card=>{
            this.tableauPile.cards[6].add(card)
        })
        //set their properties
        this.tableauPile.cards.forEach((container, i)=>{
            container.list.forEach((card, j)=>{
                card.setPosition(0, j*20)
                    .setDepth(i)
                    .setFrame(card.getData("frame"))
                    .setInteractive({draggable: true})
                    .setName("tableauPileCard")
                card.setData({x: card.x, y: card.y, pileIndex: i, cardIndex: j}) 
            })
        }) 
    }
    newGame(){
        this.createDeck();
        this.shuffleDeck()
        this.distributeDeckCardsToPiles();
    }
}