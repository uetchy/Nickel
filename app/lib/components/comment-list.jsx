import React from 'react'
import PropTypes from 'prop-types'
import ReactCanvas from 'react-canvas'

import Comment from './comment'

const Surface = ReactCanvas.Surface
const Image = ReactCanvas.Image
const Text = ReactCanvas.Text

export default class CommentList extends React.Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
    commentsPath: PropTypes.string.isRequired,
    getWindowSize: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      commentsData: [],
      commentsPositionIndex: []
    }

    // Comments frame size which will be rendered
    this.VPOS_FRAME_SIZE = 1000
  }

  loadCommentData() {
    // Load comments
    const packet = require(this.props.commentsPath)

    // Sort comments by vpos
    const commentsData = packet.comments.sort((a, b) => {
      if (a.vpos < b.vpos) {
        return -1
      } else if (a.vpos > b.vpos) {
        return 1
      }
      return 0
    })

    // Create vpos, array_index inverted index
    const commentsPositionIndex = commentsData.map((comment, index) => {
      return [comment.vpos, index]
    })

    this.setState({ commentsData, commentsPositionIndex })
    console.log('comments loaded:', commentsData.length)
  }

  getCommentCandidatesIndex = () => {
    const { currentTime } = this.props
    const { commentsPositionIndex } = this.state

    const currentPosition = currentTime * 100
    const minPosition = currentPosition - this.VPOS_FRAME_SIZE
    const maxPosition = currentPosition + this.VPOS_FRAME_SIZE
    console.log(minPosition, maxPosition)
    const candidatesIndex = commentsPositionIndex
      .filter(index => index[0] >= minPosition && index[0] <= maxPosition)
      .map(index => index[1])

    return candidatesIndex
  }

  // コメントを生成
  getCommentsToRender = () => {
    const { currentTime } = this.props
    const { commentsData } = this.state
    const currentPosition = currentTime * 100
    const w = this.props.getWindowSize()[0]

    return this.getCommentCandidatesIndex()
      .map(index => commentsData[index])
      .map(comment => {
        const marginLeft = w - (currentPosition - comment.vpos) * 1.0
        return (
          <Text>
            Here is some text below an image.
          </Text>
        )
      })
  }

  componentDidMount() {
    this.loadCommentData()
  }

  render() {
    const comments = this.getCommentsToRender()
    // console.log(comments.map(c => c.key))
    const bounds = this.props.getWindowSize()

    return (
      <Surface
        width={bounds[0]}
        height={bounds[1]}
        left={0}
        top={0}
        className="commentList"
      >
        {comments}
      </Surface>
    )
  }
}
