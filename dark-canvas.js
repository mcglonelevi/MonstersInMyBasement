class DarkCanvas extends HTMLCanvasElement {
    constructor() {
      super();
      this.drawingContext = this.getContext('2d');
      this.rects = [];
      this.fillBlack = this.fillBlack.bind(this);
      this.clearRect = this.clearRect.bind(this);
      this.rerender = this.rerender.bind(this);
    }

    fillBlack() {
        this.drawingContext.fillRect(0, 0, this.width, this.height);
    }

    clearRect(pos1, pos2) {
        this.rects.push([pos1, pos2]);
        this.drawingContext.clearRect(
            pos1[0],
            pos1[1],
            pos2[0] - pos1[0],
            pos2[1] - pos1[1]
        );
    }

    rerender(additionalRects = [])
    {
        this.fillBlack();
        this.rects.forEach(([pos1, pos2]) => this.clearRect(pos1, pos2));
        additionalRects.forEach(([pos1, pos2]) => this.clearRect(pos1, pos2));
    }
}

customElements.define(
    'dark-canvas',
    DarkCanvas,
    {
        extends: 'canvas'
    }
);