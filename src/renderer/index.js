const {remote} = require('electron');
const win = remote.getCurrentWindow();
const player = document.getElementById('player');
const playButton = document.getElementById('play');
const playback = document.getElementById('playback');
const volumeBar = document.getElementById('volume-bar');

var isSeeking = false;

player.addEventListener('loadedmetadata', function() {
  const {videoWidth, videoHeight, duration, initialTime} = this;
  win.setSize(videoWidth, videoHeight);
  win.setAspectRatio(videoWidth/videoHeight);

  playback.min = playback.value = initialTime || 0;
  playback.max = duration;

  playButton.disabled = false;
  this.play();
});

player.addEventListener("timeupdate", function() {
  if (!isSeeking) playback.value = player.currentTime;
});

playButton.addEventListener('click', function() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
});

playback.addEventListener("mousedown", function() {
  isSeeking = true;
});

playback.addEventListener("mouseup", function(e) {
  isSeeking = false;
});

playback.addEventListener('change', function() {
  player.currentTime = this.valueAsNumber;
})

volumeBar.addEventListener("change", function() {
  player.volume = volumeBar.valueAsNumber;
});

player.src = '../test2.mp4';
