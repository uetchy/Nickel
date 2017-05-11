import React from 'react'
import PropTypes from 'prop-types'

import PlayerControls from './player-controls'
import CommentList from './comment-list'

export default class Player extends React.Component {
  static propTypes = {
    setWindowSize: PropTypes.func.isRequired,
    getWindowSize: PropTypes.func.isRequired,
    videoPath: PropTypes.string.isRequired
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
  handleOnLoadedMetadata = event => {
    const { videoWidth, videoHeight, duration, initialTime } = event.target
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
      initialTime: initialTime || 0,
      duration
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
  handleOnSeeked = () => {
    console.log('onSeeked')
    // TODO: config.renderedCommentsIndex = []
    // renderComments()
  }

  // Sync playback indicator with player's current time
  handleOnTimeUpdate = event => {
    this.setState({
      currentTime: event.target.currentTime
    })
  }

  // Stop rendering comments when the player reached end
  handleOnEnded = () => {
    console.log('onEnded')
    this.setState({ play: false })
    // TODO: clearInterval(config.commentRendererTimer)
  }

  togglePlay = () => {
    if (this.player.paused) {
      this.player.play()
      this.setState({ play: true })
    } else {
      this.player.pause()
      this.setState({ play: false })
    }
  }

  setTime = time => {
    this.player.currentTime = time
  }

  setVolume = volume => {
    console.log(volume)
    this.setState({ volume })
    this.player.volume = volume
  }

  _player = component => {
    this.player = component
  }

  render() {
    return (
      <div className="player">
        <video
          src={this.props.videoPath}
          className="player-media"
          ref={this._player}
          onLoadedMetadata={this.handleOnLoadedMetadata}
          onSeeked={this.handleOnSeeked}
          onTimeUpdate={this.handleOnTimeUpdate}
          onEnded={this.handleOnEnded}
        />
        <CommentList
          commentsPath={`${this.props.videoPath}.json`}
          getWindowSize={this.props.getWindowSize}
          currentTime={this.state.currentTime}
        />
        <PlayerControls
          play={this.state.play}
          initialTime={this.state.initialTime}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          volume={this.state.volume}
          // Function
          togglePlay={this.togglePlay}
          setTime={this.setTime}
          setVolume={this.setVolume}
        />
      </div>
    )
  }
}
