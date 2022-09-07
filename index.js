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
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
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
    darkCanvas.clearRect(
      [pos1[0], pos1[1]],
      [position[0] - pos1[0], position[1] - pos1[1]]);
    // darkCanvas.rerender();
    tab.postMessage({
      type: 'coords',
      pos1,
      pos2: position
    }, '*');
    pos1 = null;
  }
});

document.querySelector('#dark-canvas').addEventListener('mousemove', (e) => {
  e.stopPropagation();
  console.log('hit');
  const now = Date.now();
  const position = getCursorPosition(e);
  if (pos1 && (!lastUpdated || lastUpdated < now - 100)) {
    console.log('updated');
    lastUpdated = now;
    darkCanvas.rerender([
      [pos1, [position[0] - pos1[0], position[1] - pos1[1]]]
    ]);
  }
});
