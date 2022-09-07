const darkCanvas = document.getElementById('dark-canvas');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scale = localStorage.getItem('scale') || 1;
let tab = null;
canvas.width = screen.width;
canvas.height = screen.height;

document.body.addEventListener('click', async () => {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Images',
        accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg']
        }
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false
  });
  const pixelsToInch = prompt('how many pixels are 1 inch in your image?');
  const fileData = await fileHandle.getFile();
  const bitmap = await createImageBitmap(fileData);
  const finalScale =  50 / pixelsToInch * scale;
  const finalWidth = bitmap.width * finalScale;
  const finalHeight = bitmap.height * finalScale;
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  darkCanvas.width = finalWidth;
  darkCanvas.height = finalHeight;
  darkCanvas.fillBlack();
  ctx.drawImage(bitmap, 0, 0, finalWidth, finalHeight);
  canvas.toBlob((b) => {
    tab = window.open('masked.html', '_blank');
    setTimeout(() => {
      tab.postMessage({
        type: 'init',
        blob: b,
      }, '*');
    }, 2000);
  });
});

function getCursorPosition(event) {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left
  const y = Math.abs(event.clientY - rect.bottom);

  return [x, y];
}

let pos1 = null;
let lastUpdated = null;

document.querySelector('#dark-canvas').addEventListener('click', (e) => {
  e.stopPropagation();
  const position = getCursorPosition(e);
  if (!pos1) {
    pos1 = position;
  } else {
    const rectangle = new Rectangle(pos1, position);
    console.log(rectangle);
    darkCanvas.storeRect(
      rectangle.lowerLeft,
      rectangle.width,
      rectangle.height
    );
    darkCanvas.rerender();
    tab.postMessage({
      type: 'coords',
      lowerLeft: rectangle.lowerLeft,
      width: rectangle.width,
      height: rectangle.height,
    }, '*');
    pos1 = null;
  }
});

document.querySelector('#dark-canvas').addEventListener('mousemove', (e) => {
  e.stopPropagation();
  if (pos1) {
    const position = getCursorPosition(e);
    const rectangle = new Rectangle(pos1, position);
    darkCanvas.rerender([
      [rectangle.lowerLeft, rectangle.width, rectangle.height]
    ]);
  }
});
