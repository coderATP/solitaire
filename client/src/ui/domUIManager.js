class DomUIManager {
  constructor() {
    this.wrapper = null;
  }
  
  show(html) {
    this.clear();
    
    this.wrapper = document.createElement("div");
    this.wrapper.className = "mini-play-dom";
    
    this.wrapper.innerHTML = html;
    
    document.body.appendChild(this.wrapper);
    
    return this.wrapper;
  }
  
  clear() {
    if (this.wrapper) {
      this.wrapper.remove();
      this.wrapper = null;
    }
  }
  
  updateOrientation(isPortrait) {
    if (!this.wrapper) {
      return;
    }
    
    const orientationElement =
      this.wrapper.querySelector(".mini-play-orientation");
    
    if (!orientationElement) {
      return;
    }
    
    orientationElement.textContent =
      isPortrait ? "Portrait" : "Landscape";
  }
  
  destroy() {
    this.clear();
  }
}

export default new DomUIManager();