var remote = require('electron').remote;
var win = remote.getCurrentWindow();
var playerElement = document.getElementById('player');
var commentsElement = document.getElementById('comments');

playerElement.addEventListener('loadedmetadata', function() {
  var width = this.videoWidth;
  var height = this.videoHeight;
  win.setSize(width, height);

  this.play();
});

playerElement.src = '../test.mp4';
