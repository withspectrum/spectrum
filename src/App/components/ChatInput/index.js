import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sendMessage } from '../../../actions/messages';
import { uploadMedia } from '../../../helpers/stories';
import { isMobile } from '../../../helpers/utils';
import EmojiPicker from '../../../shared/EmojiPicker';
import Icon from '../../../shared/Icons';
import { connect } from 'react-redux';
import { track } from '../../../EventTracker';
import {
  Input,
  Form,
  Wrapper,
  Button,
  MediaInput,
  MediaLabel,
  EmojiToggle,
} from './style';

const NEWLINES = /(\r\n|\n|\r)/gm;

class ChatInput extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      file: '',
      emojiPickerOpen: false,
    };
  }

  handleKeyPress = e => {
    if (e.keyCode === 13) {
      //=> make the enter key send a message, not create a new line in the next autoexpanding textarea
      e.preventDefault(); //=> prevent linebreak
      this.sendMessage(e); //=> send the message instead
    }
  };

  updateMessageState = e => {
    this.setState({
      // Don't let newlines be entered into messages
      message: e.target.value.replace(NEWLINES, ''),
    });
  };

  toggleEmojiPicker = e => {
    track(
      'emojiPicker',
      `${this.state.emojiPickerOpen ? 'closed' : 'opened'}`,
      null,
    );

    this.setState({
      emojiPickerOpen: !this.state.emojiPickerOpen,
    });
  };

  sendEmojiMessage = emoji => {
    track('emojiPicker', 'sent', null);

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
    let mobile = isMobile();

    return (
      <Wrapper>
        <MediaInput
          ref="media"
          type="file"
          id="file"
          name="file"
          accept=".png, .jpg, .jpeg, .gif, .mp4"
          multiple={false}
          onChange={this.sendMediaMessage}
        />
        <MediaLabel htmlFor="file">
          <Icon icon="photo" />
        </MediaLabel>
        {this.state.emojiPickerOpen &&
          <EmojiPicker
            onChange={this.sendEmojiMessage}
            closePicker={this.toggleEmojiPicker}
          />}
        <EmojiToggle
          active={this.state.emojiPickerOpen}
          onClick={this.toggleEmojiPicker}
        >
          😀
        </EmojiToggle>
        {this.props.user.uid &&
          <Form onSubmit={this.sendMessage}>
            <Input
              ref="textInput"
              placeholder="Your message here..."
              value={this.state.message}
              onChange={this.updateMessageState}
              onKeyUp={this.handleKeyPress}
              autoFocus={
                !mobile /* autofocus on desktop, don’t autofocus on mobile */
              }
            />
            <Button onClick={this.sendMessage}>
              <Icon icon="send" reverse static />
            </Button>
          </Form>}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  stories: state.stories,
});

export default connect(mapStateToProps)(ChatInput);
