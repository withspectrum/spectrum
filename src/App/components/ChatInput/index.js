import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sendMessage } from '../../../actions/messages';
import { uploadMedia } from '../../../helpers/stories';
import EmojiPicker from '../../../shared/EmojiPicker';
import { connect } from 'react-redux';
import {
  Input,
  Form,
  Footer,
  Button,
  MediaInput,
  MediaLabel,
  EmojiToggle,
} from './style';

class ChatInput extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      file: '',
      emojiPickerOpen: false,
    };
  }

  updateMessageState = e => {
    this.setState({
      message: e.target.value,
    });
  };

  toggleEmojiPicker = e => {
    this.setState({
      emojiPickerOpen: !this.state.emojiPickerOpen,
    });
  };

  sendEmojiMessage = emoji => {
    let textInput = ReactDOM.findDOMNode(this.refs.textInput);

    let message = {
      type: 'text',
      content: emoji,
    };

    this.dispatchMessage(message);

    // refocus the input
    textInput.focus();
    // close the emoji picker
    this.setState({
      emojiPickerOpen: false,
    });
  };

  sendMessage = e => {
    e.preventDefault();
    const messageText = this.state.message.trim();
    if (messageText === '') return;
    let messageObj = {
      type: 'text',
      content: messageText,
    };

    this.dispatchMessage(messageObj);

    this.setState({
      message: '',
    });
  };

  dispatchMessage = message => {
    this.props.dispatch(sendMessage(message));
  };

  sendMediaMessage = e => {
    let user = this.props.user;
    let file = e.target.files[0];
    let activeStory = this.props.stories.active;

    this.props.dispatch({
      type: 'LOADING',
    });

    uploadMedia(file, activeStory, user)
      .then(file => {
        let messageObj = {
          type: 'media',
          content: file,
        };

        this.props.dispatch({
          type: 'STOP_LOADING',
        });

        this.props.dispatch(sendMessage(messageObj));
      })
      .catch(err => {
        if (err) console.log('Error while uploading image to message: ', err);
      });
  };

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
        {this.state.emojiPickerOpen &&
          <EmojiPicker onChange={this.sendEmojiMessage} />}
        <EmojiToggle
          active={this.state.emojiPickerOpen}
          onClick={this.toggleEmojiPicker}
        >
          😀
        </EmojiToggle>
        {this.props.user.uid &&
          <Form onSubmit={this.sendMessage}>
            <Input
              autoFocus={true}
              ref="textInput"
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
