class ImageCanvas extends HTMLCanvasElement {
    constructor() {
      super();
      this.drawingContext = this.getContext('2d');
      this.setImage = this.setImage.bind(this);
    }

    async setImage(blob) {
        const bitmap = await createImageBitmap(blob);
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        this.drawingContext.drawImage(bitmap, 0, 0);
    }
}

customElements.define(
    'image-canvas',
    ImageCanvas,
    {
        extends: 'canvas'
    }
);