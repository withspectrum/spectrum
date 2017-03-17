import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
  Mentions,
  Mention,
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
      users: [],
    };

    this.debouncedShowMentionSearch = debounce(this.showMentionSearch, 500);
  }

  handleKeyPress = e => {
    if (e.keyCode === 13) {
      //=> make the enter key send a message, not create a new line in the next autoexpanding textarea
      e.preventDefault(); //=> prevent linebreak
      this.sendMessage(e); //=> send the message instead
    }
  };

  updateMessageState = e => {
    const value = e.target.value;
    this.setState({
      // Don't let newlines be entered into messages
      message: value.replace(NEWLINES, ''),
    });

    if (ENDS_WITH_MENTION.test(value)) {
      if (this.state.users.length > 0) {
        this.showMentionSearch();
      } else {
        this.debouncedShowMentionSearch();
      }
    } else {
      this.hideMentionSearch();
    }
  };

  showMentionSearch = () => {
    const mention = this.state.message.match(ENDS_WITH_MENTION)[1];
    findUsersByUsername(mention).then(users => {
      this.setState({
        users: users || [],
      });
    });
  };

  hideMentionSearch = () => {
    this.setState({
      users: [],
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

        {this.state.users.length > 0 &&
          <Mentions>
            {this.state.users.map(user => (
              <Mention key={`mention-suggestion-${user.uid}`}>
                {user.username}
              </Mention>
            ))}
          </Mentions>}

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
