class DarkCanvas extends HTMLCanvasElement {
    constructor() {
      super();
      this.drawingContext = this.getContext('webgl2', { preserveDrawingBuffer: true });
      this.rects = [];
      this.fillBlack = this.fillBlack.bind(this);
      this.clearRect = this.clearRect.bind(this);
      this.rerender = this.rerender.bind(this);
    }

    fillBlack() {
        this.drawingContext.clearColor(0, 0, 0, 1);
        this.drawingContext.clear(this.drawingContext.COLOR_BUFFER_BIT);
    }

    clearRect(lowerLeft, width, height) {
        this.rects.push([lowerLeft, width, height]);
        // turn on scissor test
        this.drawingContext.enable(this.drawingContext.SCISSOR_TEST);
        // set the clear color
        this.drawingContext.clearColor(0, 0, 0, 0);
        // set the scissor rectangle
        this.drawingContext.scissor(
            Math.round(lowerLeft[0]),
            Math.round(lowerLeft[1]),
            Math.round(width),
            Math.round(height));
        // execute drawing commands in the scissor box (e.g. clear)
        this.drawingContext.clear(this.drawingContext.COLOR_BUFFER_BIT);
        // turn off scissor test again
        this.drawingContext.disable(this.drawingContext.SCISSOR_TEST);
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