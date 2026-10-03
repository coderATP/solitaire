import { Scroll } from "../entities/Scroll.js";
import { Button } from "../entities/Button.js";
import { Icon } from "../entities/Icon.js";

//piles
import { AnomalyPile } from "../piles/Anomaly.js";
import { Hand } from "../piles/Hand.js";
import { Deck } from "../piles/Deck.js";
import { Discard } from "../piles/Discard.js";
import { ResolvedPile } from "../piles/Resolved.js";

export class GameplayUI {

    constructor(scene){
        this.scene = scene;
        this.config = scene.config;

        const { PreloadScene } = scene.game.scene.keys;
        this.preloadScene = PreloadScene;

        this.marginX = this.config.width * 0.025;

        //FONT SIZES
        this.setFontSizes();

        //PILES INSTANTIATION
        this.anomalyPile = new AnomalyPile(scene, "Time Anomaly");
        this.hand = new Hand(scene, "Hand");
        this.discard = new Discard(scene, "Discard");
        this.deck = new Deck(scene, "Deck");
        this.resolvedPile = new ResolvedPile(scene, "Resolved");

        //BACKGROUND GRAPHICS
        this.displayBackgrounds = [];
        this.turnProgressBackground = null;

        //PILES CREATION
        this.leftSection = this.middleSection = this.rightSection = undefined;

        this.createHand(this.hand);

        this.middleSection =
            new Phaser.Geom.Rectangle(
                this.leftSection.right,
                0,
                this.config.width * 0.6,
                this.config.height
            );

        const remainingSpace =
            this.config.width -
            this.middleSection.right;

        this.rightSection =
            new Phaser.Geom.Rectangle(
                this.middleSection.right,
                0,
                remainingSpace,
                this.config.height
            );

        this.createDeck(this.deck);
        this.createDiscard(this.discard);
        this.createAnomalyPile(this.anomalyPile);
        this.createResolvedPile(this.resolvedPile);

        this.piles = {
            anomalyPile: this.anomalyPile,
            deck: this.deck,
            discard: this.discard,
            hand: this.hand,
            resolvedPile: this.resolvedPile
        };

        this.createButtons();
        this.createPauseButton();
        this.createFullscreenButton();
this.createDisplayScreen();

this.anomalyPile.scroll =
    new Scroll(
        scene,
        this.anomalyPile.rect,
        this.middleSection,
        this.turnProgressRect
    );

this.anomalyPile.scroll.createScroll();
this.createIcons();

        this.updateLayout();
    }

    setBackgroundColor(
        rect,
        fillColor,
        borderColor,
        alpha = 1,
        lineWidth
    ){
        this.graphics =
            this.scene.add.graphics().setDepth(0);

        this.graphics.clear();

        this.graphics.fillStyle(
            fillColor,
            alpha
        );

        this.graphics.fillRect(
            rect.left,
            rect.top,
            rect.width,
            rect.height
        );

        if(!lineWidth){
            return this;
        }

        this.graphics.lineStyle(
            lineWidth,
            borderColor,
            1
        );

        this.graphics.strokeRect(
            rect.left,
            rect.top,
            rect.width,
            rect.height
        );

        return this;
    }

    setRoundedBackgroundColor(
        rect,
        fillColor,
        borderColor,
        alpha = 1,
        lineWidth
    ){
        this.graphics =
            this.scene.add.graphics().setDepth(0);

        this.redrawRoundedBackground(
            this.graphics,
            rect,
            fillColor,
            borderColor,
            alpha,
            lineWidth
        );

        return this;
    }

    redrawRoundedBackground(
        graphics,
        rect,
        fillColor,
        borderColor,
        alpha = 1,
        lineWidth
    ){
        if(!graphics || !rect){
            return;
        }

        graphics.clear();

        graphics.fillStyle(
            fillColor,
            alpha
        );

        graphics.fillRoundedRect(
            rect.left,
            rect.top,
            rect.width,
            rect.height
        );

        if(!lineWidth){
            return;
        }

        graphics.lineStyle(
            lineWidth,
            borderColor,
            1
        );

        graphics.strokeRoundedRect(
            rect.left,
            rect.top,
            rect.width,
            rect.height
        );
    }

    createIcons(){
        return this;
    }

    //RIGHT UI
    
    createPauseButton() {

    this.pauseButton =
        this.scene.add.text(
            0,
            0,
            "Ⅱ",
            {
                fontFamily: "myOtherFont",
                fontSize: "60px",
                color: "white"
            }
        )
        .setOrigin(0.5)
        .setDepth(10)
        .setInteractive({
            useHandCursor: true
        });

    return this;
}
createFullscreenButton() {

    this.fullscreenButton =
        this.scene.add.text(
            0,
            0,
            "⛶",
            {
                fontFamily: "myOtherFont",
                fontSize: "60px",
                color: "white"
            }
        )
        .setOrigin(0.5)
        .setDepth(10)
        .setInteractive({
            useHandCursor: true
        });

    this.fullscreenButton.on(
        "pointerdown",
        () => {
            this.toggleFullscreen();
        }
    );

    return this;
}

toggleFullscreen() {

    if (!document.fullscreenElement) {

        document.documentElement.requestFullscreen();

    }
    else if (document.exitFullscreen) {

        document.exitFullscreen();

    }
} 

    createCardsPlayedSection() {
    
    if (!this.turnProgressRect) {
        return;
    }
    
    const padding = 5;
    const margin = 5;
    
    const rows = 3;
    const cols = 3;
    
    const x =
        this.turnProgressRect.left +
        margin;
    
    const y =
        this.turnProgressRect.top +
        margin;
    
    const totalWidth =
        this.turnProgressRect.width -
        margin * 2 -
        padding * (cols - 1);
    
    const totalHeight =
        this.turnProgressRect.height -
        margin * 2 -
        padding * (rows - 1);
    
    const sectionWidth =
        totalWidth / cols;
    
    const sectionHeight =
        totalHeight / rows;
    
    this.progressSectionGraphics = [];
    this.progressSectionRects = [];
    
    for (let row = 0; row < rows; ++row) {
        
        for (let col = 0; col < cols; ++col) {
            
            const rect =
                new Phaser.Geom.Rectangle(
                    x +
                    col * (sectionWidth + padding),
                    y +
                    row * (sectionHeight + padding),
                    sectionWidth,
                    sectionHeight
                );
            
            const graphics =
                this.scene.add.graphics()
                .setDepth(1);
            
            graphics.clear();
            graphics.strokeRectShape(rect);
            
            this.progressSectionRects.push(rect);
            this.progressSectionGraphics.push(graphics);
        }
    }
}

    //BUTTONS
    createButtons(){

        const marginY = 40;
        const paddingY = 25;
        const numberOfButtons = 5;

        const totalHeight =
            this.config.height;

        const totalAvailableHeight =
            totalHeight -
            marginY * 2 -
            paddingY * (numberOfButtons - 1);

        const buttonHeight =
            totalAvailableHeight /
            numberOfButtons;

        const totalWidth =
            this.leftSection.left;

        const marginX = 2.5;

        const buttonWidth =
            totalWidth -
            marginX * 2;

        this.gameplayButtonRects = [];

        for(let i = 0; i < numberOfButtons; ++i){

            const rect =
                new Phaser.Geom.Rectangle(
                    marginX,
                    marginY +
                    i * (buttonHeight + paddingY),
                    buttonWidth,
                    buttonHeight
                );

            this.gameplayButtonRects.push(rect);
        }

        this.resolveBtn =
            new Button(
                this.scene,
                this.gameplayButtonRects[0],
                "Resolve"
            );

        this.drawBtn =
            new Button(
                this.scene,
                this.gameplayButtonRects[1],
                "Draw"
            );

        this.discardBtn =
            new Button(
                this.scene,
                this.gameplayButtonRects[2],
                "Discard"
            );

        this.swapBtn =
            new Button(
                this.scene,
                this.gameplayButtonRects[3],
                "Swap"
            );

        this.endBtn =
            new Button(
                this.scene,
                this.gameplayButtonRects[4],
                "End"
            );

        this.gameplayButtons = [
            this.resolveBtn,
            this.drawBtn,
            this.discardBtn,
            this.swapBtn,
            this.endBtn
        ];

        this.gameplayButtons.forEach(btn => {
            btn.label.setFontFamily("myOtherFont");

            btn.label.setPosition(
                btn.rect.centerX -
                btn.label.width / 2,
                btn.rect.centerY -
                btn.label.height / 2
            );
        });

        return this;
    }

    //PILES
    createAnomalyPile(pile){

        const cardDimensions =
            this.scene.getCardDimensions();

        const cardAspectRatio =
            cardDimensions.originalWidth /
            cardDimensions.originalHeight;

        const anomalyWidth =
            0.1 * this.middleSection.width;

        const anomalyHeight =
            anomalyWidth / cardAspectRatio;

        let anomalyX =
            this.middleSection.centerX -
            anomalyWidth / 2;

        let anomalyY =
            this.middleSection.centerY -
            anomalyHeight / 2;

        pile.create(
            anomalyX,
            anomalyY,
            anomalyWidth,
            anomalyHeight
        );
    }

    createResolvedPile(pile){

        const cardDimensions =
            this.scene.getCardDimensions();

        const cardAspectRatio =
            cardDimensions.originalWidth /
            cardDimensions.originalHeight;

        const resolvedWidth =
            0.1 * this.middleSection.width;

        const resolvedHeight =
            resolvedWidth / cardAspectRatio;

        let resolvedX =
            this.middleSection.left;

        let resolvedY =
            this.middleSection.centerY -
            resolvedHeight / 2;

        pile.create(
            resolvedX,
            resolvedY,
            resolvedWidth,
            resolvedHeight
        );
    }

    createDeck(pile){

        const cardDimensions =
            this.scene.getCardDimensions();

        const cardAspectRatio =
            cardDimensions.originalWidth /
            cardDimensions.originalHeight;

        const deckHeight =
            0.20 * this.config.height;

        const deckWidth =
            deckHeight * cardAspectRatio;

        let deckX =
            this.middleSection.right -
            deckWidth -
            5;

        let deckY =
            this.middleSection.top +
            5;

        pile.create(
            deckX,
            deckY,
            deckWidth,
            deckHeight
        );
    }

    createDiscard(pile){

        const cardDimensions =
            this.scene.getCardDimensions();

        const cardAspectRatio =
            cardDimensions.originalWidth /
            cardDimensions.originalHeight;

        const discardHeight =
            0.20 * this.config.height;

        const discardWidth =
            discardHeight * cardAspectRatio;

        let discardX =
            this.middleSection.right -
            discardWidth -
            5;

        let discardY =
            this.middleSection.bottom -
            discardHeight -
            5;

        pile.create(
            discardX,
            discardY,
            discardWidth,
            discardHeight
        );
    }

    createHand(pile){

        const totalHeight =
            this.config.height;

        const marginY = 80;
        const paddingY = 10;

        const rows = 4;
        const cols = 2;

        const marginX = 5;
        const paddingX = 10;

        const availableHeight =
            totalHeight -
            marginY * 2 -
            paddingY * (rows - 1);

        const cardDimensions =
            this.scene.getCardDimensions();

        const cardAspectRatio =
            cardDimensions.originalWidth /
            cardDimensions.originalHeight;

        const handHeight =
            availableHeight / rows;

        const handWidth =
            handHeight * cardAspectRatio;

        const totalOccupiedWidth =
            marginX * 2 +
            handWidth * cols +
            paddingX * (cols - 1);

        this.leftSection =
            new Phaser.Geom.Rectangle(
                this.config.width * 0.1,
                0,
                totalOccupiedWidth,
                this.config.height
            );

        let handX;
        let handY;

        for(let i = 0; i < cols; ++i){

            handX =
                this.leftSection.left +
                i * (handWidth + paddingX) +
                marginX;

            for(let j = 0; j < rows; ++j){

                handY =
                    j * (handHeight + paddingY) +
                    marginY;

                pile.create(
                    handX,
                    handY,
                    handWidth,
                    handHeight,
                    i * rows + j
                );
            }
        }

        this.handRect =
            new Phaser.Geom.Rectangle(
                this.hand.rects[0].x,
                this.hand.rects[0].y,
                (
                    this.hand.rects[7].x +
                    this.hand.rects[7].width
                ) -
                this.hand.rects[0].x,
                (
                    this.hand.rects[7].y +
                    this.hand.rects[7].height
                ) -
                this.hand.rects[0].y
            );
    }
    
    updateResourceTexts() {
    
    if (
        !this.displayRects ||
        !this.displayHeaders ||
        !this.displayTexts
    ) {
        return;
    }
    
    this.displayHeaders.forEach(
        (header, index) => {
            
            const rect =
                this.displayRects[index];
            
            const text =
                this.displayTexts[index];
            
            if (!rect || !header || !text) {
                return;
            }
            
            const gap = 8;
            
            //Keep the label on the left.
            header.setPosition(
                rect.left + 8,
                rect.centerY -
                header.displayHeight / 2
            );
            
            //Always keep the value immediately
            //after the label.
            text.setPosition(
                header.x +
                header.displayWidth +
                gap,
                rect.centerY -
                text.displayHeight / 2
            );
        }
    );
}

    update(time, delta){

        this.discardBtn &&
            this.discardBtn.updateFontSize(0.75);

        this.gameplayButtons.forEach(btn => {

            btn.label.setFontSize(
                this.discardBtn.currentFontSize
            );

            btn.label.setPosition(
                btn.rect.centerX -
                btn.label.width / 2,
                btn.rect.centerY -
                btn.label.height / 2
            );
        });
    }

    createNewTurnMessage(turn){

        this.turn = turn;

        this.turnMessage =
            this.scene.add.text(
                0,
                0,
                "Turn " + turn,
                {
                    fontFamily: "myOtherFont",
                    fontSize: "60px",
                    color: "white"
                }
            )
            .setOrigin(0);

        this.turnMessage.setPosition(
            this.middleSection.centerX -
            this.turnMessage.width / 2,
            this.middleSection.top + 120
        )
        .setVisible(true);
    }

    hideMessage(){
        this.turnMessage.setVisible(false);
    }

    setFontSizes(){

        if(this.scene.config.width < 360){

            this.turnProgressHeaderFontSize = 20;
            this.turnProgressMessageFontSize = 20;

        }
        else if(this.scene.config.width < 720){

            this.turnProgressHeaderFontSize = 25;
            this.turnProgressMessageFontSize = 30;

        }
        else{

            this.turnProgressHeaderFontSize = 30;
            this.turnProgressMessageFontSize = 40;
        }
    }

    updateLayout() {
    
    const isPortrait =
        this.config.height > this.config.width;
    
    if (isPortrait) {
        this.layoutPortrait();
    }
    else {
        this.layoutLandscape();
    }
    
    this.updatePileGraphics();
    
    if (
        this.anomalyPile &&
        this.anomalyPile.scroll
    ) {
        
        this.anomalyPile.scroll.rect =
            this.anomalyPile.rect;
        
        this.anomalyPile.scroll.middleSection =
            this.middleSection;
        
        this.anomalyPile.scroll.turnProgressRect =
            this.turnProgressRect;
        
        this.anomalyPile.scroll.setSize();
        this.anomalyPile.scroll.fit();
        this.anomalyPile.scroll.updateObjectivesPosition();
    }
    
    if (this.scene.progressMessage) {
        this.scene.progressMessage.updateLayout();
    }
}


    layoutLandscape(){

        this.layoutHandLandscape();

        this.middleSection =
            new Phaser.Geom.Rectangle(
                this.leftSection.right,
                0,
                this.config.width * 0.6,
                this.config.height
            );

        const remainingSpace =
            this.config.width -
            this.middleSection.right;

        this.rightSection =
            new Phaser.Geom.Rectangle(
                this.middleSection.right,
                0,
                remainingSpace,
                this.config.height
            );

        this.layoutButtonsLandscape();
        this.layoutPilesLandscape();
        this.layoutRightInterfaceLandscape();

        
    }

    layoutPortrait(){

        this.layoutHandPortrait();

        const controlsHeight =
            this.config.height * 0.10;

        const handHeight =
            this.config.height * 0.125;

        const progressHeight =
            this.config.height * 0.12;

        const middleHeight =
            this.config.height -
            handHeight -
            progressHeight -
            controlsHeight;

        const middleY =
            handHeight;

        this.middleSection =
            new Phaser.Geom.Rectangle(
                0,
                middleY,
                this.config.width,
                middleHeight
            );

        this.rightSection =
            new Phaser.Geom.Rectangle(
                0,
                middleY +
                middleHeight +
                progressHeight,
                this.config.width,
                controlsHeight
            );

        this.layoutButtonsPortrait();
        this.layoutPilesPortrait();
        this.layoutRightInterfacePortrait();

        
    }

    layoutHandLandscape(){

    const totalHeight = this.config.height;
    const marginY = 80;
    const paddingY = 10;
    const rows = 4;
    const cols = 2;
    const marginX = 5;
    const paddingX = 10;

    const availableHeight =
        totalHeight -
        marginY * 2 -
        paddingY * (rows - 1);

    const dimensions = this.scene.getCardDimensions();
    const aspectRatio =
        dimensions.originalWidth /
        dimensions.originalHeight;

    const handHeight =
        availableHeight / rows;

    const handWidth =
        handHeight * aspectRatio;

    const totalOccupiedWidth =
        marginX * 2 +
        handWidth * cols +
        paddingX * (cols - 1);

    this.leftSection =
        new Phaser.Geom.Rectangle(
            this.config.width * 0.1,
            0,
            totalOccupiedWidth,
            this.config.height
        );

    for(let col = 0; col < cols; ++col){

        for(let row = 0; row < rows; ++row){

            const index =
                col * rows + row;

            const x =
                this.leftSection.left +
                col * (handWidth + paddingX) +
                marginX;

            const y =
                row * (handHeight + paddingY) +
                marginY;

            this.updateHandPosition(
                index,
                x,
                y,
                handWidth,
                handHeight
            );
        }
    }

    this.updateHandRect();
}

layoutHandPortrait() {
    
    const totalWidth = this.config.width;
    const cols = 8;
    const paddingX = 4;
    
    const dimensions = this.scene.getCardDimensions();
    const aspectRatio =
        dimensions.originalWidth /
        dimensions.originalHeight;
    
    const availableWidth =
        totalWidth -
        paddingX * (cols - 1) -
        10;
    
    const handWidth =
        availableWidth / cols;
    
    const handHeight =
        handWidth / aspectRatio;
    
    const handY = 20;
    
    const totalOccupiedWidth =
        handWidth * cols +
        paddingX * (cols - 1);
    
    const startX =
        (totalWidth - totalOccupiedWidth) / 2;
    
    this.leftSection =
        new Phaser.Geom.Rectangle(
            startX,
            0,
            totalOccupiedWidth,
            this.config.height * 0.125
        );
    
    for (let i = 0; i < cols; ++i) {
        
        const x =
            startX +
            i * (handWidth + paddingX);
        
        this.updateHandPosition(
            i,
            x,
            handY,
            handWidth,
            handHeight
        );
    }
    
    this.updateHandRect();
}


    updateHandPosition(
    index,
    x,
    y,
    width,
    height
) {
    
    const rect =
        this.hand.rects[index];
    
    const zone =
        this.hand.zones[index];
    
    const container =
        this.hand.containers[index];
    
    if (!rect || !zone || !container) {
        return;
    }
    
    rect.setTo(
        x,
        y,
        width,
        height
    );
    
    zone.setPosition(
        x,
        y
    );
    
    zone.setSize(
        width,
        height
    );
    
    container.setPosition(
        x,
        y
    );
    
    container.setSize(
        width,
        height
    );
    
    //Resize any card currently inside the hand container.
    if (container.list && container.list.length) {
        
        container.list.forEach(card => {
            
            if (card.setDisplaySize) {
                
                card.setDisplaySize(
                    width,
                    height
                );
                
                card.setPosition(
                    0,
                    0
                );
            }
        });
    }
}


    updateHandRect(){

        if(!this.handRect){
            return;
        }

        if(!this.hand.rects.length){
            return;
        }

        this.handRect.setTo(
            this.leftSection.x,
            this.leftSection.y,
            this.leftSection.width,
            this.leftSection.height
        );
    }

    layoutPilesLandscape() {
    
    const middle =
        this.middleSection;
    
    //Anomaly stays at the centre.
    this.positionAnomaly(
        middle.centerX,
        middle.centerY
    );
    
    //Resolved at the top-centre.
    this.positionResolved(
        middle.centerX,
        middle.top + 5
    );
    
    //Discard at the top-left.
    this.positionDiscard(
        middle.left + middle.width * 0.08,
        middle.top + 5
    );
    
    //Deck at the top-right.
    this.positionDeck(
        middle.right - middle.width * 0.08,
        middle.top + 5
    );
    this.positionPauseButton();
}

    layoutPilesPortrait() {
    
    const middle =
        this.middleSection;
    
    //Anomaly stays at the centre.
    this.positionAnomaly(
        middle.centerX,
        middle.centerY
    );
    
    //Resolved at the top-centre.
    this.positionResolved(
        middle.centerX,
        middle.top + 5
    );
    
    //Discard at the top-left.
    this.positionDiscard(
        middle.left + middle.width * 0.17,
        middle.top + 5
    );
    
    //Deck at the top-right.
    this.positionDeck(
        middle.right - middle.width * 0.17,
        middle.top + 5
    );
    this.positionPauseButton();
}

    positionAnomaly(centerX, centerY) {
    
    const pile =
        this.anomalyPile;
    
    const dimensions =
        this.scene.getCardDimensions();
    
    const aspectRatio =
        dimensions.originalWidth /
        dimensions.originalHeight;
    
    const width =
        this.middleSection.width * 0.10;
    
    const height =
        width / aspectRatio;
    
    this.updatePile(
        pile,
        centerX - width / 2,
        centerY - height / 2,
        width,
        height
    );
}

positionResolved(centerX, topY) {
    
    const pile =
        this.resolvedPile;
    
    const dimensions =
        this.scene.getCardDimensions();
    
    const aspectRatio =
        dimensions.originalWidth /
        dimensions.originalHeight;
    
    const width =
        this.middleSection.width * 0.075;
    
    const height =
        width / aspectRatio;
    
    this.updatePile(
        pile,
        centerX - width / 2,
        topY,
        width,
        height
    );
}

positionDeck(centerX, topY) {

    const pile =
        this.deck;

    const dimensions =
        this.scene.getCardDimensions();

    const aspectRatio =
        dimensions.originalWidth /
        dimensions.originalHeight;

    const width =
        this.middleSection.width * 0.075;

    const height =
        width / aspectRatio;

    this.updatePile(
        pile,
        centerX - width / 2,
        topY,
        width,
        height
    );

    if (pile.name) {

        pile.name.setPosition(
            pile.x +
            pile.width / 2 -
            pile.name.width / 2,
            pile.y +
            pile.height -
            2
        );
    }
}

positionDiscard(centerX, topY) {
    
    const pile =
        this.discard;
    
    const dimensions =
        this.scene.getCardDimensions();
    
    const aspectRatio =
        dimensions.originalWidth /
        dimensions.originalHeight;
    
    const width =
        this.middleSection.width * 0.075;
    
    const height =
        width / aspectRatio;
    
    this.updatePile(
        pile,
        centerX - width / 2,
        topY,
        width,
        height
    );
}


    updatePile(
    pile,
    x,
    y,
    width,
    height
) {
    
    if (!pile) {
        return;
    }
    
    pile.x = x;
    pile.y = y;
    pile.width = width;
    pile.height = height;
    
    if (pile.rect) {
        
        pile.rect.setTo(
            x,
            y,
            width,
            height
        );
    }
    
    if (pile.container) {
        
        pile.container.setPosition(
            x,
            y
        );
        
        pile.container.setSize(
            width,
            height
        );
        
        //Resize any card currently inside the pile container.
        if (
            pile.container.list &&
            pile.container.list.length
        ) {
            
            pile.container.list.forEach(card => {
                
                if (card.setDisplaySize) {
                    
                    card.setDisplaySize(
                        width,
                        height
                    );
                    
                    card.setPosition(
                        0,
                        0
                    );
                }
            });
        }
    }
    
    if (pile.zone) {
        
        pile.zone.setPosition(
            x,
            y
        );
        
        pile.zone.setSize(
            width,
            height
        );
    }
}


    layoutButtonsLandscape(){

        const marginY = 40;
        const paddingY = 25;

        const numberOfButtons =
            this.gameplayButtons.length;

        const totalAvailableHeight =
            this.config.height -
            marginY * 2 -
            paddingY *
            (numberOfButtons - 1);

        const buttonHeight =
            totalAvailableHeight /
            numberOfButtons;

        const buttonWidth =
            this.leftSection.left - 5;

        for(let i = 0; i < numberOfButtons; ++i){

            const rect =
                new Phaser.Geom.Rectangle(
                    2.5,
                    marginY +
                    i * (buttonHeight + paddingY),
                    buttonWidth,
                    buttonHeight
                );

            this.updateButton(
                this.gameplayButtons[i],
                rect
            );
        }
    }

    layoutButtonsPortrait(){

        const count =
            this.gameplayButtons.length;

        const paddingX = 5;

        const width =
            (
                this.config.width -
                paddingX * (count - 1)
            ) / count;

        const height =
            this.config.height * 0.075;

        const y =
            this.config.height * 0.925;

        for(let i = 0; i < count; ++i){

            const rect =
                new Phaser.Geom.Rectangle(
                    i * (width + paddingX),
                    y,
                    width,
                    height
                );

            this.updateButton(
                this.gameplayButtons[i],
                rect
            );
        }
    }

    updateButton(button, rect){

        if(!button){
            return;
        }

        button.rect.setTo(
            rect.x,
            rect.y,
            rect.width,
            rect.height
        );

        button.hitArea.setPosition(
            rect.x,
            rect.y
        );

        button.hitArea.setSize(
            rect.width,
            rect.height
        );

        button.graphics.clear();

        button.label.setPosition(
            rect.centerX -
            button.label.width / 2,
            rect.centerY -
            button.label.height / 2
        );

        button.setBackgroundColor(
            0x22aa22,
            0x000000,
            1,
            4,
            1
        );
    }

    layoutRightInterfaceLandscape() {
    
    const right =
        this.rightSection;
    
    const margin = 5;
    
    this.turnProgressRect.setTo(
        right.x + margin,
        right.y + margin,
        right.width - margin * 2,
        right.height - margin * 2
    );
    
    //Top section for the 3 × 3 Cards Dealt grid.
    const progressHeight =
        this.turnProgressRect.height * 0.65;
    
    //Bottom section for the three resource subsections.
    const resourceHeight =
        this.turnProgressRect.height -
        progressHeight;
    
    const resourceY =
        this.turnProgressRect.top +
        progressHeight;
    
    const resourceSectionHeight =
        resourceHeight / 3;
    
    //Resource sections.
    if (this.SPRect) {
        
        this.SPRect.setTo(
            this.turnProgressRect.left,
            resourceY,
            this.turnProgressRect.width,
            resourceSectionHeight
        );
    }
    
    if (this.RPRect) {
        
        this.RPRect.setTo(
            this.turnProgressRect.left,
            resourceY +
            resourceSectionHeight,
            this.turnProgressRect.width,
            resourceSectionHeight
        );
    }
    
    if (this.DPRect) {
        
        this.DPRect.setTo(
            this.turnProgressRect.left,
            resourceY +
            resourceSectionHeight * 2,
            this.turnProgressRect.width,
            resourceSectionHeight
        );
    }
    
    if (this.rewardsSectionRect) {
    
    this.rewardsSectionRect.setTo(
        this.SPRect.left,
        this.SPRect.top,
        this.SPRect.width,
        this.SPRect.height +
        this.RPRect.height +
        this.DPRect.height
    );
}
    //Cards dealt / Turn Progress occupies
    //the top subsection.
    this.layoutProgressCardsLandscape(
        this.turnProgressRect.left,
        this.turnProgressRect.top,
        this.turnProgressRect.width,
        progressHeight
    );
    
    this.redrawDisplayBackgrounds();
    this.redrawTurnProgressBackground();
    this.updateResourceTexts();
}

    layoutRightInterfacePortrait() {
    
    const width =
        this.config.width;
    
    const y =
        this.middleSection.bottom;
    
    const height =
        this.config.height * 0.12;
    
    const margin = 5;
    
    //The whole portrait Turn Progress /
    //Resource Points area.
    this.turnProgressRect.setTo(
        margin,
        y + margin,
        width - margin * 2,
        height - margin * 2
    );
    
    const pointsWidth =
        this.turnProgressRect.width * 0.35;
    
    const progressWidth =
        this.turnProgressRect.width -
        pointsWidth;
    
    const resourceHeight =
        this.turnProgressRect.height / 3;
    
    if (this.SPRect) {
        
        this.SPRect.setTo(
            this.turnProgressRect.left,
            this.turnProgressRect.top,
            pointsWidth,
            resourceHeight
        );
    }
    
    if (this.RPRect) {
        
        this.RPRect.setTo(
            this.turnProgressRect.left,
            this.turnProgressRect.top +
            resourceHeight,
            pointsWidth,
            resourceHeight
        );
    }
    
    if (this.DPRect) {
        
        this.DPRect.setTo(
            this.turnProgressRect.left,
            this.turnProgressRect.top +
            resourceHeight * 2,
            pointsWidth,
            resourceHeight
        );
    }
    
    if (this.rewardsSectionRect) {
    
    this.rewardsSectionRect.setTo(
        this.SPRect.left,
        this.SPRect.top,
        this.SPRect.width,
        this.SPRect.height +
        this.RPRect.height +
        this.DPRect.height
    );
}
    //Cards dealt / Turn Progress occupies
    //the right column.
    this.layoutProgressCardsPortrait(
        this.turnProgressRect.left +
        pointsWidth,
        this.turnProgressRect.top,
        progressWidth,
        this.turnProgressRect.height
    );
    
        this.redrawDisplayBackgrounds();
        this.redrawTurnProgressBackground();
        this.updateResourceTexts();
    }
    positionPauseButton() {
    
    if (
        !this.pauseButton ||
        !this.fullscreenButton
    ) {
        return;
    }
    
    const middle = this.middleSection;
    
    const isPortrait =
        this.config.height > this.config.width;
    
    const size =
        isPortrait ?
        this.config.width * 0.10 :
        this.config.height * 0.10;
    
    const x =
        middle.left +
        middle.width * 0.08;
    
    const pauseY =
        middle.top +
        this.discard.rect.bottom +
        size * 0.75;
    
    this.pauseButton.setScale(
        size / 70
    );
    
    this.pauseButton.setPosition(
        this.discard.rect.centerX,
        pauseY
    );
    
    this.fullscreenButton.setFontSize(
        size * 0.85
    );
    
    this.fullscreenButton.setPosition(
        this.discard.rect.centerX + size * 1.25,
        pauseY
    );
}



    redrawDisplayBackgrounds(){

        if(
            !this.displayBackgrounds ||
            !this.displayRects
        ){
            return;
        }

        this.displayBackgrounds.forEach(
            (graphics, index) => {

                const rect =
                    this.displayRects[index];

                if(!graphics || !rect){
                    return;
                }

                this.redrawRoundedBackground(
                    graphics,
                    rect,
                    0x22aa22,
                    0x0000ff,
                    0.8
                );
            }
        );
    }

    redrawTurnProgressBackground(){

        if(
            !this.turnProgressBackground ||
            !this.turnProgressRect
        ){
            return;
        }

        this.redrawRoundedBackground(
            this.turnProgressBackground,
            this.turnProgressRect,
            0x22aa22,
            0x0000ff,
            0.8
        );
    }

    layoutProgressCardsLandscape(
    x,
    y,
    width,
    height
) {
    
    if (!this.progressSectionRects) {
        return;
    }
    
    const rows = 3;
    const cols = 3;
    const padding = 5;
    
    const cardWidth =
        (
            width -
            padding * (cols + 1)
        ) / cols;
    
    const cardHeight =
        (
            height -
            padding * (rows + 1)
        ) / rows;
    
    for (
        let i = 0;
        i < this.progressSectionRects.length;
        ++i
    ) {
        
        const col =
            i % cols;
        
        const row =
            Math.floor(i / cols);
        
        this.progressSectionRects[i].setTo(
            x +
            padding +
            col * (cardWidth + padding),
            y +
            padding +
            row * (cardHeight + padding),
            cardWidth,
            cardHeight
        );
    }
    
    this.updateProgressSectionGraphics();
}


layoutProgressCardsPortrait(
    x,
    y,
    width,
    height
){

    if(!this.progressSectionRects){
        return;
    }

    const rows = 3;
    const cols = 3;
    const padding = 5;

    const cardWidth =
        (
            width -
            padding * (cols + 1)
        ) / cols;

    const cardHeight =
        (
            height -
            padding * (rows + 1)
        ) / rows;

    for(let i = 0; i < this.progressSectionRects.length; ++i){

        const col =
            i % cols;

        const row =
            Math.floor(i / cols);

        this.progressSectionRects[i].setTo(
            x +
            padding +
            col * (cardWidth + padding),
            y +
            padding +
            row * (cardHeight + padding),
            cardWidth,
            cardHeight
        );
    }

    this.updateProgressSectionGraphics();
}
createDisplayScreen() {
    
    const margin = 5;
    
    //The complete Turn Progress / Resource Points area.
    this.turnProgressRect =
        new Phaser.Geom.Rectangle(
            this.rightSection.left + margin,
            this.rightSection.top + margin,
            this.rightSection.width - margin * 2,
            this.rightSection.height - margin * 2
        );
    
    //Create the outer background first.
    this.setRoundedBackgroundColor(
        this.turnProgressRect,
        0x22aa22,
        0x0000ff,
        0.8
    );
    
    this.turnProgressBackground =
        this.graphics;
    
    //Resource point sections.
    this.displayHeaders = [];
    this.displayRects = [];
    this.displayTexts = [];
    
    const pointsWidth =
        this.turnProgressRect.width * 0.35;
    
    const resourceHeight =
        this.turnProgressRect.height / 3;
    
    const headers = [
        "Swap Point: ",
        "Resource Point: ",
        "Draw Point: "
    ];
    
    for (let i = 0; i < 3; ++i) {
        
        const rect =
            new Phaser.Geom.Rectangle(
                this.turnProgressRect.left,
                this.turnProgressRect.top +
                i * resourceHeight,
                pointsWidth,
                resourceHeight
            );
        
        this.setRoundedBackgroundColor(
            rect,
            0x22aa22,
            0x0000ff,
            0.8
        );
        
        this.displayBackgrounds.push(
            this.graphics
        );
        
        const header =
            this.scene.add.text(
                0,
                0,
                headers[i],
                {
                    fontSize: "25px",
                    fontFamily: "myOtherFont",
                    color: "gold"
                }
            )
            .setOrigin(0);
        
        const text =
            this.scene.add.text(
                0,
                0,
                "0",
                {
                    fontSize: "40px",
                    fontFamily: "myOtherFont",
                    color: "gold"
                }
            )
            .setOrigin(0);
        
        this.displayRects.push(rect);
        this.displayHeaders.push(header);
        this.displayTexts.push(text);
    }
    
    this.SPRect =
        this.displayRects[0];
    
    this.RPRect =
        this.displayRects[1];
    
    this.DPRect =
        this.displayRects[2];
        
    this.rewardsSectionRect =
    new Phaser.Geom.Rectangle(
        this.SPRect.left,
        this.SPRect.top,
        this.SPRect.width,
        this.SPRect.height +
        this.RPRect.height +
        this.DPRect.height
    ); 
    
    this.SPHeader =
        this.displayHeaders[0];
    
    this.RPHeader =
        this.displayHeaders[1];
    
    this.DPHeader =
        this.displayHeaders[2];
    
    this.SPText =
        this.displayTexts[0];
    
    this.RPText =
        this.displayTexts[1];
    
    this.DPText =
        this.displayTexts[2];
    
    this.SPText.setText(3);
    this.DPText.setText(3);
    
    this.updateResourceTexts();
    
    //Create the 3 × 3 Turn Progress grid.
    this.createCardsPlayedSection();
    
    return this;
}

    updateProgressSectionGraphics(){

        if(
            !this.progressSectionRects ||
            !this.progressSectionGraphics
        ){
            return;
        }

        this.progressSectionGraphics.forEach(
            (graphics, index) => {

                const rect =
                    this.progressSectionRects[index];

                if(!graphics || !rect){
                    return;
                }

                graphics.clear();

                graphics
                    .strokeRectShape(rect)
                    .setDepth(1);
            }
        );
    }

    updatePileGraphics(){

        const piles = [
            this.anomalyPile,
            this.resolvedPile,
            this.deck,
            this.discard
        ];

        piles.forEach(pile => {

            if(
                pile &&
                pile.rect &&
                pile.rect.graphics
            ){

                pile.rect.graphics.clear();

                pile.rect.graphics
                    .strokeRectShape(pile.rect)
                    .setDepth(0);
            }
        });

        if(this.hand){

            this.hand.rects.forEach(rect => {

                if(rect.graphics){

                    rect.graphics.clear();

                    rect.graphics
                        .strokeRectShape(rect)
                        .setDepth(0);
                }
            });
        }
    }
}