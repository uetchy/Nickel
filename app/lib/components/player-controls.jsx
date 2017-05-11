import React from 'react'
import PropTypes from 'prop-types'

export default class PlayerControls extends React.Component {
  static propTypes = {
    play: PropTypes.bool.isRequired,
    currentTime: PropTypes.number.isRequired,
    initialTime: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    togglePlay: PropTypes.func.isRequired,
    setTime: PropTypes.func.isRequired,
    setVolume: PropTypes.func.isRequired
  }

  // Toggle play/pause
  handleOnClickPlayButton = () => {
    this.props.togglePlay()
  }

  // Start seeking
  handleOnStartSeeking = () => {
    this.setState({ isSeeking: true })
  }

  // Finish seeking
  handleOnEndSeeking = () => {
    this.setState({ isSeeking: false })
  }

  // After seeked
  handleOnChangeTime = event => {
    this.props.setTime(event.target.valueAsNumber)
  }

  // Change player volume
  handleOnChangeVolume = event => {
    this.props.setVolume(event.target.valueAsNumber)
  }

  render() {
    const { duration, initialTime, currentTime, volume } = this.props
    return (
      <div className="playerControls hover">
        <div id="titlebar" />
        <div id="controls">
          <div className="controls--upper">
            <i className="fa fa-volume-down" />
            <input
              type="range"
              id="volume-bar"
              step={0.1}
              min={0}
              max={1}
              value={volume}
              onChange={this.handleOnChangeVolume}
            />
            <i className="fa fa-volume-up" />
            <button id="play" onClick={this.handleOnClickPlayButton}>
              <i className="fa fa-play" />
            </button>
          </div>
          <div className="controls--bottom">
            <span id="currentTime">{Math.floor(currentTime)}</span>
            <input
              type="range"
              id="playback"
              min={initialTime}
              max={duration}
              value={currentTime}
              onChange={this.handleOnChangeTime}
              onMouseDown={this.handleOnStartSeeking}
              onMouseUp={this.handleOnEndSeeking}
            />
            <span id="remainingTime">
              -{Math.floor(duration - currentTime)}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
