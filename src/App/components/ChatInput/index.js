import React, { Component } from 'react';
import actions from '../../../actions';
import helpers from '../../../helpers';
import { connect } from 'react-redux';
import { Input, Form, Footer, Button, MediaInput, MediaLabel } from './style';

class ChatInput extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      file: ''
    };
  }

  updateMessageState = e => {
    this.setState({
      message: e.target.value,
    });
  };

  sendMessage = e => {
    e.preventDefault();
    const messageText = this.state.message.trim();
    if (messageText === '') return
    let messageObj = {
      type: 'text',
      content: messageText
    }

    this.props.dispatch(actions.sendMessage(messageObj));

    this.setState({
      message: '',
    });
  };

  sendMediaMessage = (e) => {
    let user = this.props.user
    let file = e.target.files[0]
    let activeStory = this.props.stories.active

    this.props.dispatch({
      type: 'LOADING'
    })

    helpers.uploadMedia(file, activeStory, user)
      .then((file) => {
        let messageObj = {
          type: 'media',
          content: file
        }

        this.props.dispatch({
          type: 'STOP_LOADING'
        })

        this.props.dispatch(actions.sendMessage(messageObj))
      }).catch(err => {
        if (err) console.log('Error while uploading image to message: ', err)
      })
  }

  render() {
    return (
      <Footer>
        <MediaInput
          ref="media"
          type="file"
          id="file"
          name="file"
          accept=".png, .jpg, .jpeg, .gif, .mp4"
          multiple={false}
          onChange={this.sendMediaMessage}
        />
        <MediaLabel htmlFor="file">+ Upload Image</MediaLabel>
        {this.props.user.uid &&
          <Form onSubmit={this.sendMessage}>
            <Input
              placeholder="Your message here..."
              value={this.state.message}
              onChange={this.updateMessageState}
            />
            <Button onClick={this.sendMessage}>↩</Button>
          </Form>}
      </Footer>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  stories: state.stories,
});

export default connect(mapStateToProps)(ChatInput);
