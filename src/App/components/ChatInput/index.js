import React, { Component } from 'react'
import actions from '../../../actions'
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
		const message = this.state.message

		this.props.dispatch(actions.sendMessage(message))
		this.setState({
			message: ''
		})
	}

  render() {
    return (
    	<Footer>
	    	{ this.props.user.uid &&
	    		<Form onSubmit={ this.sendMessage }>
	    			<Input placeholder="Your message here..." value={this.state.message} onChange={this.updateMessageState} />
	    			<Button onClick={this.sendMessage}>&#8617;</Button>
	    		</Form>
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
