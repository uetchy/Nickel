import React, {Component, PropTypes} from 'react'

export default class PlayerControls extends Component {
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

  constructor(props){
    super(props)
  }

  // Toggle play/pause
  onClickPlayButton = () => {
    this.props.togglePlay()
  }

  // Start seeking
  onStartSeeking = () => {
    this.setState({isSeeking: true})
  }

  // Finish seeking
  onEndSeeking = () => {
    this.setState({isSeeking: false})
  }

  // After seeked
  onChangeTime = (event) => {
    this.props.setTime(event.target.valueAsNumber)
  }

  // Change player volume
  onChangeVolume = (event) => {
    this.props.setVolume(event.target.valueAsNumber)
  }

  render(){
    const {play, duration, initialTime, currentTime, volume} = this.props
    return (
      <div className="playerControls">
        <div id="titlebar"></div>
        <div id="controls">
          <div className="controls--upper">
            <i className="fa fa-volume-down"></i>
            <input
              type="range"
              id="volume-bar"
              step={0.1}
              min={0}
              max={1}
              value={volume}
              onChange={this.onChangeVolume}/>
            <i className="fa fa-volume-up"></i>
            <button
              id="play"
              onClick={this.onClickPlayButton} >
              <i className="fa fa-play"></i>
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
              onChange={this.onChangeTime}
              onMousedown={this.onStartSeeking}
              onMouseup={this.onEndSeeking} />
            <span id="remainingTime">-{Math.floor(duration - currentTime)}</span>
          </div>
        </div>
      </div>
    )
  }
}
