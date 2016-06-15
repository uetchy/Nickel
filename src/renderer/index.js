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

const VPOS_FRAME_SIZE = 1000;

var config = {
  isSeeking: false,
  commentRendererTimer: null,
  renderedCommentsIndex: [],
  comments: [],
  vposIndex: []
};

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

  console.log("video loaded:", duration);

  playButton.disabled = false;
  this.play();
});

player.addEventListener('play', function(e) {
  console.log("play");
  renderComments();
  config.commentRendererTimer = setInterval(renderComments, VPOS_FRAME_SIZE * 10 / 2);
})

player.addEventListener('seeked', function(e) {
  console.log("seeked");
  config.renderedCommentsIndex = [];
  renderComments();
});

player.addEventListener('timeupdate', function(e) {
  if (!config.isSeeking) playback.value = player.currentTime;
});

player.addEventListener('ended', function(e) {
  console.log("ended");
  clearInterval(config.commentRendererTimer);
});

playButton.addEventListener('click', function() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
});

playback.addEventListener('mousedown', function() {
  config.isSeeking = true;
});

playback.addEventListener('mouseup', function(e) {
  config.isSeeking = false;
});

playback.addEventListener('change', function() {
  player.currentTime = this.valueAsNumber;
})

volumeControl.addEventListener('input', function() {
  player.volume = this.valueAsNumber;
});

video_path = remote.process.argv[2];

// Collect comments within frame range
function frameCollect(start, frameSize) {
  let end = start + frameSize;
  return config
    .vposIndex
    .filter(index => {
      return (index[0] >= start && index[0] <= end);
    })
    .map(index => {
      return index[1];
    });
}

// Render comments
function renderComments(){
  // インターバルごとにフレーム窓の対象となるコメントを算出
  const {comments} = config;
  const currentVpos = player.currentTime * 100;
  const commentCandidatesIndex = frameCollect(currentVpos, VPOS_FRAME_SIZE);
  console.log("renderComments vpos:", currentVpos);
  console.log("renderedCount:", config.renderedCommentsIndex.length);

  // 描画していないコメントのみを対象にアニメーションを予約
  commentCandidatesIndex.forEach(function(candidateIndex) {
    if (config.renderedCommentsIndex.indexOf(candidateIndex) > -1) return;
    let comment = comments[candidateIndex];
    let remaining = comment.vpos - currentVpos;
    // setTimeout(function(){
    //   console.log(comment.vpos, comment.body);
    // }, remaining*10);
    console.log("RENDER", remaining * 10, comment.body);
    config.renderedCommentsIndex.push(candidateIndex);
  });
}

// Load comments
var packet = require(`${video_path}.json`);

// Sort comments by vpos
config.comments = packet
  .comments
  .sort((a, b) => {
    if (a.vpos < b.vpos) return -1;
    if (a.vpos > b.vpos) return 1;
    return 0;
  });

// Create vpos, array_index T index
config.vposIndex = config
  .comments
  .map((comment, index) => {
    return [comment.vpos, index];
  });

console.log("comment loaded:", config.comments.length);

// Load video
player.src = video_path;
