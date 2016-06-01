var {remote} = require('electron');
var win = remote.getCurrentWindow();
var playerElement = document.getElementById('player');

playerElement.addEventListener('loadedmetadata', function() {
  var {videoWidth, videoHeight} = this;
  win.setSize(videoWidth, videoHeight);
  win.setAspectRatio(videoWidth/videoHeight);
  this.play();
});

playerElement.src = '../test2.mp4';
