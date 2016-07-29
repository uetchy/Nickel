import React, {PropTypes, Component} from 'react'

export default class Comment extends Component {
	static propTypes = {
		text: PropTypes.string.isRequired
	}

	constructor(props) {
		super(props)
		this.state = {}
	}

	render() {
		const {text} = this.props
		return (
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
		)
	}
}
