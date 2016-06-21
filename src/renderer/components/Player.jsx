import React, {Component, PropTypes} from 'react'

import PlayerControls from './PlayerControls'
import CommentList from './CommentList'

export default class Player extends Component {
  static propTypes = {
    setWindowSize: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      initialTime: 0,
      duration: 0,
      currentTime: 0,
      play: false,
      volume: 1.0
    }
  }

  // Initialize video player as metadata was loaded
  onLoadedMetadata = (event) => {
    const {videoWidth, videoHeight, duration, initialTime} = event.target
    console.log('metadata loaded:', event.target.duration)

    // Set window size same as video size
    this.props.setWindowSize({
      width: videoWidth,
      height: videoHeight,
      ratio: videoWidth / videoHeight
    })

    this.setState({
      width: videoWidth,
      height: videoHeight,
      duration: duration,
      initialTime: initialTime || 0
    })

    // Play video
    this.togglePlay()
  }

  // Render comments if player start playing
  // onPlay = () => {
    // TODO: renderComments()
// config.commentRendererTimer = setInterval(renderComments, VPOS_FRAME_SIZE * 10 / 2)
  // }

  // Reconstruct comments and render if player was seeked
  onSeeked = () => {
    console.log('onSeeked')
    // TODO: config.renderedCommentsIndex = []
    // renderComments()
  }

  // Sync playback indicator with player's current time
  onTimeUpdate = (event) => {
    this.setState({
      currentTime: event.target.currentTime
    })
  }

  // Stop rendering comments when the player reached end
  onEnded = () => {
    console.log('onEnded')
    this.setState({play: false})
    // TODO: clearInterval(config.commentRendererTimer)
  }

  componentDidMount() {
    let {player} = this.refs

    // Start loading video
    player.src = this.props.videoPath
  }

  togglePlay = () => {
    let {player} = this.refs
    if (player.paused) {
      player.play()
      this.setState({play: true})
    } else {
      player.pause()
      this.setState({play: false})
    }
  }

  setTime = (time) => {
    this.refs.player.currentTime = time
  }

  setVolume = (volume) => {
    console.log(volume);
    this.setState({volume: volume})
    this.refs.player.volume = volume
  }

  render(){
    return (
      <div className="player">
        <video
          className="player-media"
          ref="player"
          volume={this.state.volume}
          onLoadedMetadata={this.onLoadedMetadata}
          //onPlay={this.onPlay}
          onSeeked={this.onSeeked}
          onTimeUpdate={this.onTimeUpdate}
          onEnded={this.onEnded} />
        <CommentList
          videoPath={this.props.videoPath}
          currentTime={this.state.currentTime} />
        <PlayerControls
          play={this.state.play}
          initialTime={this.state.initialTime}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          volume={this.state.volume}
          // Function
          togglePlay={this.togglePlay}
          setTime={this.setTime}
          setVolume={this.setVolume} />
      </div>
    )
  }
}
