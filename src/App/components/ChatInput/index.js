import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Mention } from 'react-mentions';
import { sendMessage } from '../../../actions/messages';
import { uploadMedia } from '../../../helpers/stories';
import { isMobile, debounce } from '../../../helpers/utils';
import EmojiPicker from '../../../shared/EmojiPicker';
import Icon from '../../../shared/Icons';
import { connect } from 'react-redux';
import { track } from '../../../EventTracker';
import { findUsersByUsername } from '../../../db/users';
import {
  Input,
  Form,
  Wrapper,
  Button,
  MediaInput,
  MediaLabel,
  EmojiToggle,
  MentionSuggestion,
} from './style';

const NEWLINES = /(\r\n|\n|\r)/gm;
const ENDS_WITH_MENTION = /@(\w+)$/;

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

  updateMessageState = e => {
    const value = e.target.value;
    this.setState({
      // Don't let newlines be entered into messages
      message: value.replace(NEWLINES, ''),
    });
  };

  findUsers = (mention, cb) => {
    findUsersByUsername(mention).then(users => {
      cb(
        users.map(user => ({
          ...user,
          // react-mentions expects this
          id: user.uid,
          display: user.username,
        })),
      );
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

  renderUserSuggestion = user => {
    return <MentionSuggestion>{user.username}</MentionSuggestion>;
  };

  displayTransform = (_, display) => {
    return `@${display}`;
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

  dispatchMessage = message => {
    this.props.dispatch(sendMessage(message));
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
              singleLine
              placeholder="Your message here..."
              value={this.state.message}
              onChange={this.updateMessageState}
              displayTransform={this.displayTransform}
              markup={
                '<a href="https://spectrum.chat/@__id__">@__display__</a>'
              }
              autoFocus={
                !mobile /* autofocus on desktop, don’t autofocus on mobile */
              }
            >
              <Mention
                trigger="@"
                appendSpaceOnAdd
                data={this.findUsers}
                renderSuggestion={this.renderUserSuggestion}
              />
            </Input>
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
