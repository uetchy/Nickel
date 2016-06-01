var {remote} = require('electron');
var win = remote.getCurrentWindow();
var playerElement = document.getElementById('player');

playerElement.addEventListener('loadedmetadata', function() {
  var width = this.videoWidth;
  var height = this.videoHeight;
  win.setSize(width, height);
  win.setAspectRatio(width/height);
  this.play();
});

playerElement.src = '../test2.mp4';
