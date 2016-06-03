const {remote} = require('electron');
const fs = require('fs');
const path = require('path');
const {parseString} = require('xml2js');
const win = remote.getCurrentWindow();
const player = document.getElementById('player');
const playButton = document.getElementById('play');
const playback = document.getElementById('playback');
const volumeControl = document.getElementById('volume-bar');
const commentsContainer = document.getElementById('comments');

var isSeeking = false;
var len, dur;

player.addEventListener('loadedmetadata', function() {
  const {
    videoWidth,
    videoHeight,
    duration,
    initialTime
  } = this;
  win.setSize(videoWidth, videoHeight);
  win.setAspectRatio(videoWidth / videoHeight);

  playback.min = playback.value = initialTime || 0;
  playback.max = duration;

  console.log("duration:", duration);
  dur = duration;

  playButton.disabled = false;
  this.play();
});

// player.addEventListener('timeupdate', function(e) {
//   if (!isSeeking) playback.value = player.currentTime;
// });

playButton.addEventListener('click', function() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
});

playback.addEventListener('mousedown', function() {
  isSeeking = true;
});

playback.addEventListener('mouseup', function(e) {
  isSeeking = false;
});

playback.addEventListener('change', function() {
  player.currentTime = this.valueAsNumber;
})

volumeControl.addEventListener('input', function() {
  player.volume = volumeControl.valueAsNumber;
});

video_path = remote.process.argv[2];

// Start loading video
player.src = path.join('..', video_path);

// Process comments
comments_path = `${path.basename(video_path, path.extname(video_path))}.xml`;
xml = fs.readFileSync(comments_path, "utf-8");
parseString(xml, function (err, result) {
  comments = result['packet']['chat']
    .map(function(comment){
      body = comment['_'];
      metadata = comment['$'];
      vpos = parseInt(metadata['vpos']);
      return [vpos, body];
    })
    .sort(function(a,b){
      if( a[0] < b[0] ) return -1;
      if( a[0] > b[0] ) return 1;
      return 0;
    });
  console.log(comments);
  len = comments.length;

  player.addEventListener('timeupdate', function(e) {
    if (!isSeeking) playback.value = player.currentTime;
    commentIndex = Math.round(player.currentTime/dur * len);
    console.log(comments[commentIndex][0], player.currentTime*100);
  });
});
