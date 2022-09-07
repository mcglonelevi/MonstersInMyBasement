const scale = localStorage.getItem('scale') || 1;
document.getElementById('scale').value = scale;
document.querySelector('.calibrator .box').style.setProperty('--scale', scale);

function onCalibrationChange() {
  const value = document.getElementById('scale').value;
  localStorage.setItem('scale', value);
  document.querySelector('.calibrator .box').style.setProperty('--scale', value);
}