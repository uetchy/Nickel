import React, {Component, PropTypes} from 'react'

import Comment from './comment'

export default class CommentList extends Component {
	static propTypes = {
		currentTime: PropTypes.number,
		videoPath: PropTypes.string,
		getWindowSize: PropTypes.func
	}

	constructor(props) {
		super(props)
		this.state = {
			commentRendererTimer: null,
			renderedCommentsIndex: [],
			commentsData: [],
			commentVposIndex: [],
			comments: []
		}

		// Comments frame size which will be rendered
		this.VPOS_FRAME_SIZE = 1000
	}

	componentDidMount() {
		this.loadCommentData()
		this.queueCommentsToRender()
		this.setState({
			commentRendererTimer: setInterval(this.queueCommentsToRender, this.VPOS_FRAME_SIZE * 10 / 2)
		})
	}

	loadCommentData() {
		// Load comments
		const packet = require(`${this.props.videoPath}.json`)

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
		const commentVposIndex = commentsData.map((comment, index) => {
			return [comment.vpos, index]
		})

		this.setState({commentsData, commentVposIndex})
		console.log('comments loaded:', commentsData.length)
	}

	getCommentCandidatesIndex = () => {
		const {currentTime} = this.props
		const {commentVposIndex} = this.state

		const currentVpos = currentTime * 100
		const endVpos = currentVpos + this.VPOS_FRAME_SIZE
		const commentCandidatesIndex = commentVposIndex.filter(index => {
			return (index[0] >= currentVpos && index[0] <= endVpos)
		}).map(index => {
			return index[1]
		})

		console.log('candidates:', commentCandidatesIndex)
		return commentCandidatesIndex
	}

	// 描画していないコメントのみを対象にアニメーションを予約
	queueCommentsToRender = () => {
		const {currentTime} = this.props
		const {comments, commentsData, renderedCommentsIndex} = this.state
		const currentVpos = currentTime * 100

		this.getCommentCandidatesIndex()
			.filter(index => {
				return !renderedCommentsIndex.includes(index)
			})
			.map(index => {
				renderedCommentsIndex.push(index)
				return commentsData[index]
			})
			.forEach(comment => {
				const remainingVpos = comment.vpos - currentVpos
				// console.log('RENDER', remainingVpos * 10, comment)

				setTimeout(() => {
					const component = (<Comment
						key={comment.no}
						text={comment.body}
						remainingVpos={remainingVpos}
						/>)
					comments.push(component)
					this.setState({comments})
				}, remainingVpos * 10)
			})
	}

	render() {
		return (
			<div className="commentList">
				{this.state.comments}
			</div>
		)
	}
}
