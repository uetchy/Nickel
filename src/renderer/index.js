var {remote} = require('electron');
var win = remote.getCurrentWindow();
var player = document.getElementById('player');

player.addEventListener('loadedmetadata', function() {
  const {videoWidth, videoHeight} = this;
  win.setSize(videoWidth, videoHeight);
  win.setAspectRatio(videoWidth/videoHeight);
  this.play();
});

player.addEventListener('seeked', function(e) {
  console.log(e);
})

player.src = '../test.mp4';
