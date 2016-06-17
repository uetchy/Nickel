const {remote} = require('electron');
const win = remote.getCurrentWindow();

// DOM elements
const playerElement = document.getElementById('player');
const playButtonElement = document.getElementById('play');
const playbackElement = document.getElementById('playback');
const volumeControlElement = document.getElementById('volume-bar');
const commentsContainerElement = document.getElementById('comments');
const currentTimeIndicatorElement = document.getElementById('currentTime');
const remainingTimeIndicatorElement = document.getElementById('remainingTime');

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
playerElement.addEventListener('loadedmetadata', function() {
  const {
    videoWidth,
    videoHeight,
    duration,
    initialTime
  } = this;

  // Set window size same as video size
  win.setSize(videoWidth, videoHeight);
  win.setAspectRatio(videoWidth / videoHeight);

  // Put video length into playbackElement control
  playbackElement.min = playbackElement.value = initialTime || 0;
  playbackElement.max = duration;

  console.log('video loaded:', duration);

  // Play video
  playButtonElement.disabled = false;
  this.play();
});

// Render comments if player start playing
playerElement.addEventListener('play', function() {
  console.log('play');
  renderComments();
  config.commentRendererTimer = setInterval(renderComments, VPOS_FRAME_SIZE * 10 / 2);
})

// Reconstruct comments and render if player was seeked
playerElement.addEventListener('seeked', function() {
  console.log('seeked');
  config.renderedCommentsIndex = [];
  renderComments();
});

// Sync playback indicator with player's current time
playerElement.addEventListener('timeupdate', function() {
  if (!config.isSeeking) {
    playbackElement.value = playerElement.currentTime;
    currentTimeIndicatorElement.innerHTML = Math.floor(playerElement.currentTime);
    remainingTimeIndicatorElement.innerHTML = '-' + Math.floor(playerElement.duration - playerElement.currentTime);
  }

});

// Stop rendering comments when the player reached end
playerElement.addEventListener('ended', function() {
  console.log('ended');
  clearInterval(config.commentRendererTimer);
});

// Toggle play/pause
playButtonElement.addEventListener('click', function() {
  if (playerElement.paused) {
    playerElement.play();
  } else {
    playerElement.pause();
  }
});

// Start seeking
playbackElement.addEventListener('mousedown', function() {
  config.isSeeking = true;
});

// Finish seeking
playbackElement.addEventListener('mouseup', function() {
  config.isSeeking = false;
});

// After seeked
playbackElement.addEventListener('change', function() {
  playerElement.currentTime = this.valueAsNumber;
})

// Change the player volume
volumeControlElement.addEventListener('input', function() {
  playerElement.volume = this.valueAsNumber;
});

const video_path = remote.process.argv[2];

// Render comments
function renderComments(){
  // Collect comments within frame range
  const {comments} = config;
  const currentVpos = playerElement.currentTime * 100;
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
    commentsContainerElement.innerHTML = comment.body;
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
playerElement.src = video_path;
