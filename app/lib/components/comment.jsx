import React, { PropTypes, Component } from 'react'

export default class Comment extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    startPosition: PropTypes.number.isRequired,
    currentPosition: PropTypes.number.isRequired,
    marginLeft: PropTypes.number,
    top: PropTypes.number
  }

  componentDidMount() {
    setInterval(this.updatePosition, 1000)
  }

  updatePosition() {}

  render() {
    const { text } = this.props
    const style = {
      fontSize: '5px',
      position: 'absolute',
      width: text.length + 1 + 'em',
      marginLeft: this.props.marginLeft,
      top: this.props.top
    }
    return (
      <div className="comment" style={style}>
        {text}
      </div>
    )
  }
}
