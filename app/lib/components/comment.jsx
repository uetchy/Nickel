import React, {PropTypes, Component} from 'react'

export default class Comment extends Component {
	static propTypes = {
		text: PropTypes.string.isRequired,
		remainingVpos: PropTypes.number.isRequired
	}

	constructor(props) {
		super(props)
		this.state = {
			visible: true
		}
	}

	componentDidMount() {
		setTimeout(() => {
			console.log('destroy')
			this.setState({visible: false})
		}, 5000)
	}

	render() {
		const {text} = this.props
		return this.state.visible ? (
			<div
				className="comment"
				style={{
					top: 0,
					transform: 'translateX(0)',
					right: '100%'
				}}
				>
				{text}
			</div>
		) : null
	}
}
