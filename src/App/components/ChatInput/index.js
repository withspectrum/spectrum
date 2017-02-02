import React, { Component } from 'react'
// import { login } from '../../../actions/user'
import { sendMessage } from '../../../actions/messages'
import { login } from '../../../actions/user';
import { connect } from 'react-redux'
import { Input, Form, Footer, Button, LoginText, LoginButton, LoginWrapper } from './style'

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
  login = (e) => {
    e.preventDefault();
    this.props.dispatch(login())
  }

  render() {
    return (
    	<Footer>
	    	{ this.props.user.uid ?
	    		<Form onSubmit={ this.sendMessage }>
	    			<Input placeholder="Your message here..." value={this.state.message} onChange={this.updateMessageState} />
	    			<Button onClick={this.sendMessage}>↩︎</Button>
	    		</Form>

	    		:
	    		<LoginWrapper>
		    		<LoginText>Log in with Twitter to get started!</LoginText>
		    		<LoginButton onClick={this.login}>Join</LoginButton>
	    		</LoginWrapper>
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
