import React, { Component } from 'react'
import { sendMessage } from '../../../actions/messages'
import { connect } from 'react-redux'
import { Input } from './style'

class ChatInput extends Component {
	constructor() {
		super()
		this.state = {
			message: ''
		}
	}

	updateMessageState = (e) => {
		this.setState({
			message: e.target.value
		})
	}

	sendMessage = (e) => {
		e.preventDefault()
		const user = this.props.user
		const activeStory = this.props.stories.active
		const message = this.state.message

		this.props.dispatch(sendMessage(user, activeStory, message))
		this.setState({
			message: ''
		})
	}

  render() {
    return (
    	<div>
	    	{ this.props.stories.active &&
	    		<form onSubmit={ this.sendMessage }>
	    			<Input placeholder="Your message here..." value={this.state.message} onChange={this.updateMessageState} />
	    			<button onSubmit={this.login}>Submit</button>
	    		</form>
	    	}
    	</div>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.user,
  stories: state.stories
})

export default connect(mapStateToProps)(ChatInput);