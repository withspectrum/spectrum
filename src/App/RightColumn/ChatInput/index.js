import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { sendMessage } from '../../../actions/messages';
import { uploadMedia } from '../../../db/stories';
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
      mediaUploading: false,
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

  appendEmoji = emoji => {
    track('emojiPicker', 'sent', null);

    let textInput = ReactDOM.findDOMNode(this.refs.textInput);
    let value = textInput.value;
    let startPosition = textInput.selectionStart;

    // insert the emoji at the cursor position of the input
    value = [
      value.slice(0, startPosition),
      emoji,
      value.slice(startPosition),
    ].join('');

    // refocus the input
    textInput.focus();
    // close the emoji picker
    this.setState({
      emojiPickerOpen: false,
      message: value,
    });
  };

  sendMessage = e => {
    e.preventDefault();
    let messageText = this.state.message.trim();
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

  sendMediaMessage = e => {
    let user = this.props.user;
    let file = e.target.files[0];
    let activeStory = this.props.stories.active;

    this.setState({
      mediaUploading: true,
    });

    this.props.dispatch({
      type: 'LOADING',
    });

    uploadMedia(file, activeStory, user)
      .then(file => {
        track('media', 'uploaded', null);
        let messageObj = {
          type: 'media',
          content: file,
        };

        this.setState({
          mediaUploading: false,
        });

        this.props.dispatch({
          type: 'STOP_LOADING',
        });

        this.props.dispatch(sendMessage(messageObj));
      })
      .catch(err => {
        if (err) console.log('Error while uploading image to message: ', err);
        this.setState({
          mediaUploading: false,
        });
      });
  };

  dispatchMessage = message => {
    this.props.dispatch(sendMessage(message));

    // the current user has sent a message, so force the parent to scroll to bottom
    // on the next tick, after the message has rendered
    setTimeout(() => {
      this.props.forceScrollToBottom();
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
          <Icon
            icon="photo"
            tipLocation="top-right"
            tipText="Upload Photo"
            subtle
          />
        </MediaLabel>
        <EmojiToggle
          active={this.state.emojiPickerOpen}
          onClick={this.toggleEmojiPicker}
        >
          <Icon
            icon="emoji"
            tipText="Insert Emoji"
            tipLocation="top-right"
            subtle
          />
        </EmojiToggle>
        {this.props.user.uid &&
          <Form onSubmit={this.sendMessage}>
            {this.state.emojiPickerOpen &&
              <EmojiPicker
                onChange={this.appendEmoji}
                closePicker={this.toggleEmojiPicker}
              />}
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
