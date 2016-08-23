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
			commentsData: [],
			commentsPositionIndex: []
		}

		// Comments frame size which will be rendered
		this.VPOS_FRAME_SIZE = 1000
	}

	componentDidMount() {
		this.loadCommentData()
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
		const commentsPositionIndex = commentsData.map((comment, index) => {
			return [comment.vpos, index]
		})

		this.setState({commentsData, commentsPositionIndex})
		console.log('comments loaded:', commentsData.length)
	}

	getCommentCandidatesIndex = () => {
		const {currentTime} = this.props
		const {commentsPositionIndex} = this.state

		const currentPosition = currentTime * 100
		const minPosition = currentPosition - this.VPOS_FRAME_SIZE
		const maxPosition = currentPosition + this.VPOS_FRAME_SIZE
		console.log(minPosition, maxPosition)
		const candidatesIndex = commentsPositionIndex
			.filter(index => (index[0] >= minPosition && index[0] <= maxPosition))
			.map(index => index[1])

		return candidatesIndex
	}

	// コメントを生成
	getCommentsToRender = () => {
		const {currentTime} = this.props
		const {commentsData} = this.state
		const currentPosition = currentTime * 100
		const w = this.props.getWindowSize()[0]

		return this.getCommentCandidatesIndex()
			.map(index => commentsData[index])
			.map(comment => {
				const marginLeft = w - ((currentPosition - comment.vpos) * 1.0)
				return (
					<Comment
						key={comment.no}
						text={comment.body}
						startPosition={comment.vpos}
						currentPosition={currentPosition}
						top={comment.no}
						marginLeft={marginLeft}
						/>
				)
			})
	}

	render() {
		const comments = this.getCommentsToRender()
		// console.log(comments.map(c => c.key))

		return (
			<div className="commentList">
				{comments}
			</div>
		)
	}
}
