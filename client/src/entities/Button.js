export class Button extends Phaser.GameObjects.Container {
  
  constructor(scene, rect, label, iconKey = null) {
    
    super(
      scene,
      rect.centerX,
      rect.centerY
    );
    
    
    this.scene = scene;
    this.rect = rect;
    this.labelText = label;
    this.iconKey = iconKey;
    
    
    this.graphics =
      scene.add.graphics();
    
    
    this.icon = null;
    
    
    this.label =
      scene.add.text(
        0,
        0,
        label,
        {
          fontFamily: "myOtherFont",
          fontSize: "24px",
          color: "#ffffff",
          align: "center"
        }
      );
    
    
    this.label.setOrigin(0.5);
    
    
    this.add(
      this.graphics
    );
    
    this.add(
      this.label
    );
    
    
    if (iconKey) {
      
      this.icon =
        scene.add.image(
          0,
          0,
          iconKey
        );
      
      this.add(
        this.icon
      );
    }
    
    
    this.hitArea =
      scene.add.zone(
        0,
        0,
        rect.width,
        rect.height
      );
    
    
    this.hitArea.setInteractive();
    
    
    this.add(
      this.hitArea
    );
    
    
    this.setSize(
      rect.width,
      rect.height
    );
    
    
    this.updateLayout();
    
    
    scene.add.existing(
      this
    );
  }
  
  
  updateLayout() {
  
  this.setPosition(
    this.rect.centerX,
    this.rect.centerY
  );
  
  this.setSize(
    this.rect.width,
    this.rect.height
  );
  
  this.hitArea.setPosition(
    0,
    0
  );
  
  this.hitArea.setSize(
    this.rect.width,
    this.rect.height
  );
  
  const iconSize =
    Math.min(
      this.rect.width * 0.30,
      this.rect.height * 0.30
    );
  
  if (this.icon) {
    this.icon.setPosition(
      0,
      -this.rect.height * 0.16
    );
    
    const scale =
      Math.min(
        iconSize / this.icon.width,
        iconSize / this.icon.height
      );
    
    this.icon.setScale(scale);
  }
  
  const maxFontSize = 24;
  const minFontSize = 12;
  const horizontalPadding = 12;
  
  this.label.setFontSize(maxFontSize);
  
  const availableWidth =
    Math.max(
      1,
      this.rect.width - horizontalPadding * 2
    );
  
  if (this.label.width > availableWidth) {
    const fontSize =
      Math.max(
        minFontSize,
        maxFontSize *
        availableWidth /
        this.label.width
      );
    
    this.label.setFontSize(fontSize);
  }
  
  const labelY =
    this.rect.height * 0.30;
  
  this.label.setPosition(
    0,
    labelY
  );
}
  
  
  setLabel(text) {
    
    this.labelText = text;
    
    this.label.setText(
      text
    );
    
    this.updateLayout();
    
    return this;
  }
  
  
  setIcon(iconKey) {
    
    if (this.icon) {
      
      this.icon.destroy();
      
      this.icon = null;
    }
    
    
    this.iconKey =
      iconKey;
    
    
    if (iconKey) {
      
      this.icon =
        this.scene.add.image(
          0,
          0,
          iconKey
        );
      
      
      this.add(
        this.icon
      );
    }
    
    
    this.updateLayout();
    
    return this;
  }
  
  
  setBackgroundColor(
    fillColor = 0x22aa22,
    lineColor = 0x000000,
    fillAlpha = 1,
    lineWidth = 4,
    lineAlpha = 1
  ) {
    
    this.graphics.clear();
    
    
    this.graphics.fillStyle(
      fillColor,
      fillAlpha
    );
    
    
    this.graphics.fillRoundedRect(
      -this.rect.width / 2,
      -this.rect.height / 2,
      this.rect.width,
      this.rect.height,
      12
    );
    
    
    this.graphics.lineStyle(
      lineWidth,
      lineColor,
      lineAlpha
    );
    
    
    this.graphics.strokeRoundedRect(
      -this.rect.width / 2,
      -this.rect.height / 2,
      this.rect.width,
      this.rect.height,
      12
    );
    
    
    return this;
  }
  
  
  updateRect(rect) {
    
    this.rect.setTo(
      rect.x,
      rect.y,
      rect.width,
      rect.height
    );
    
    
    this.updateLayout();
    
    return this;
  }
}