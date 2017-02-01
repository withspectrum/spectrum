import React, { Component } from 'react'
import { sendMessage } from '../../../actions/messages'
import { connect } from 'react-redux'
import { Input, Form, Footer, Button } from './style'

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
    	<Footer>
	    	{ this.props.stories.active ?
	    		<Form onSubmit={ this.sendMessage }>
	    			<Input placeholder="Your message here..." value={this.state.message} onChange={this.updateMessageState} />
	    			<Button onClick={this.sendMessage}>↩︎</Button>
	    		</Form>

	    		:
	    		<div>
		    		<span>Log in with Twitter to get started!</span>
		    		<button onClick={this.login}>Join</button>
	    		</div>
	    	}
    	</Footer>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.user,
  stories: state.stories
})

export default connect(mapStateToProps)(ChatInput);