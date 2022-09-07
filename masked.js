const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const darkCanvas = document.getElementById('dark-canvas');

window.onmessage = async function (e) {
    console.log(e);
    if (e.data.type === 'init') {
        await canvas.setImage(e.data.blob);
        darkCanvas.width = canvas.width;
        darkCanvas.height = canvas.height;
        darkCanvas.fillBlack();
    } else if (e.data.type === 'coords') {
        darkCanvas.clearRect(e.data.pos1, e.data.pos2);
    }
}
