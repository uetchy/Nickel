import React, {Component} from 'react'

import Comment from './Comment'

export default class CommentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentRendererTimer: null,
      renderedCommentsIndex: [],
      comments: [],
      vposIndex: []
    }

    // Comments frame size which will be rendered
    this.VPOS_FRAME_SIZE = 1000
  }

  componentDidMount() {
    this.loadComments()
    this.queueCommentsToRender()
    this.setState({
      commentRendererTimer: setInterval(this.queueCommentsToRender, this.VPOS_FRAME_SIZE * 10 / 2)
    })
  }

  loadComments() {
    // Load comments
    const packet = require(`${this.props.videoPath}.json`)

    // Sort comments by vpos
    const comments = packet.comments.sort((a, b) => {
      if (a.vpos < b.vpos)
        return -1
      if (a.vpos > b.vpos)
        return 1
      return 0
    })

    // Create vpos, array_index inverted index
    const vposIndex = comments.map((comment, index) => {
      return [comment.vpos, index]
    })

    this.setState({comments: comments, vposIndex: vposIndex})
    console.log('comments loaded:', comments.length)
  }

  // 描画していないコメントのみを対象にアニメーションを予約
  queueCommentsToRender = () => {
    const {currentTime} = this.props
    const {comments, renderedCommentsIndex} = this.state
    const currentVpos = currentTime * 100

    this.getCommentCandidatesIndex().forEach((candidateIndex) => {
      if (renderedCommentsIndex.indexOf(candidateIndex) > -1)
        return
      const comment = comments[candidateIndex]
      const remainingVpos = comment.vpos - currentVpos
      // TODO: CSS Animation
      console.log('RENDER', remainingVpos * 10, comment.body)
      commentsContainerElement.innerHTML = comment.body
      renderedCommentsIndex.push(candidateIndex)
    })
  }

  getCommentCandidatesIndex = () => {
    const {currentTime} = this.props
    const {comments, vposIndex} = this.state

    const currentVpos = currentTime * 100
    const endVpos = currentVpos + this.VPOS_FRAME_SIZE
    const commentCandidatesIndex = vposIndex.filter(index => {
      return (index[0] >= currentVpos && index[0] <= endVpos)
    }).map(index => {
      return index[1]
    })

    console.log('candidates:', commentCandidatesIndex)
    return commentCandidatesIndex
  }

  render() {
    return (
      <div class="commentList"></div>
    )
  }
}
