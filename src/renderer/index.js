const {remote} = require('electron');
const win = remote.getCurrentWindow();

// DOM elements
const player = document.getElementById('player');
const playButton = document.getElementById('play');
const playback = document.getElementById('playback');
const volumeControl = document.getElementById('volume-bar');
const commentsContainer = document.getElementById('comments');

// Comments frame size which will be rendered
const VPOS_FRAME_SIZE = 1000;

// Global config
var config = {
  isSeeking: false,
  commentRendererTimer: null,
  renderedCommentsIndex: [],
  comments: [],
  vposIndex: []
};

// Initialize video player as metadata was loaded
player.addEventListener('loadedmetadata', function() {
  const {
    videoWidth,
    videoHeight,
    duration,
    initialTime
  } = this;

  // Set window size same as video size
  win.setSize(videoWidth, videoHeight);
  win.setAspectRatio(videoWidth / videoHeight);

  // Put video length into playback control
  playback.min = playback.value = initialTime || 0;
  playback.max = duration;

  console.log('video loaded:', duration);

  // Play video
  playButton.disabled = false;
  this.play();
});

// Render comments if player start playing
player.addEventListener('play', function() {
  console.log('play');
  renderComments();
  config.commentRendererTimer = setInterval(renderComments, VPOS_FRAME_SIZE * 10 / 2);
})

// Reconstruct comments and render if player was seeked
player.addEventListener('seeked', function() {
  console.log('seeked');
  config.renderedCommentsIndex = [];
  renderComments();
});

// Sync playback indicator with player's current time
player.addEventListener('timeupdate', function() {
  if (!config.isSeeking) playback.value = player.currentTime;
});

// Stop rendering comments when the player reached end
player.addEventListener('ended', function() {
  console.log('ended');
  clearInterval(config.commentRendererTimer);
});

// Toggle play/pause
playButton.addEventListener('click', function() {
  if (player.paused) {
    player.play();
  } else {
    player.pause();
  }
});

// Start seeking
playback.addEventListener('mousedown', function() {
  config.isSeeking = true;
});

// Finish seeking
playback.addEventListener('mouseup', function() {
  config.isSeeking = false;
});

// After seeked
playback.addEventListener('change', function() {
  player.currentTime = this.valueAsNumber;
})

// Change the player volume
volumeControl.addEventListener('input', function() {
  player.volume = this.valueAsNumber;
});

const video_path = remote.process.argv[2];

// Render comments
function renderComments(){
  // Collect comments within frame range
  const {comments} = config;
  const currentVpos = player.currentTime * 100;
  const endVpos = currentVpos + VPOS_FRAME_SIZE;
  const commentCandidatesIndex = config
    .vposIndex
    .filter(index => {
      return (index[0] >= currentVpos && index[0] <= endVpos);
    })
    .map(index => {
      return index[1];
    });

  console.log('renderComments vpos:', currentVpos);
  console.log('renderedCount:', config.renderedCommentsIndex.length);

  // 描画していないコメントのみを対象にアニメーションを予約
  commentCandidatesIndex.forEach(function(candidateIndex) {
    if (config.renderedCommentsIndex.indexOf(candidateIndex) > -1) return;
    const comment = comments[candidateIndex];
    const remainingVpos = comment.vpos - currentVpos;
    // TODO: CSS Animation
    console.log('RENDER', remainingVpos * 10, comment.body);
    config.renderedCommentsIndex.push(candidateIndex);
  });
}

// Load comments
const packet = require(`${video_path}.json`);

// Sort comments by vpos
config.comments = packet
  .comments
  .sort((a, b) => {
    if (a.vpos < b.vpos) return -1;
    if (a.vpos > b.vpos) return 1;
    return 0;
  });

// Create vpos, array_index inverted index
config.vposIndex = config
  .comments
  .map((comment, index) => {
    return [comment.vpos, index];
  });

console.log('comment loaded:', config.comments.length);

// Load a video file
player.src = video_path;
