import React, { Component, PropTypes } from 'react'
import { remote } from 'electron' // eslint-disable-line import/no-extraneous-dependencies

import Player from './player'

export default class Root extends Component {
  static propTypes = {
    videoPath: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.win = remote.getCurrentWindow()
  }

  setWindowSize = args => {
    this.win.setSize(args.width, args.height)
    this.win.setAspectRatio(args.width / args.height)
  }

  getWindowSize = () => {
    return this.win.getSize()
  }

  render() {
    return (
      <div className="root">
        <Player
          videoPath={this.props.videoPath}
          setWindowSize={this.setWindowSize}
          getWindowSize={this.getWindowSize}
        />
      </div>
    )
  }
}
