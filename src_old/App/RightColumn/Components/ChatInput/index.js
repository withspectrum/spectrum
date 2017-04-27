//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { sendMessage } from '../../../../actions/messages';
import { throwError } from '../../../../actions/errors';
import { uploadMediaToLocation } from '../../../../db/media';
import { isMobile } from '../../../../helpers/utils';
import EmojiPicker from '../../../../shared/EmojiPicker';
import Icon from '../../../../shared/Icons';
import { track } from '../../../../EventTracker';
import {
  Input,
  Form,
  Wrapper,
  MediaInput,
  MediaLabel,
  EmojiToggle,
  SendButton,
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
      autofocus: false,
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
      null
    );

    this.setState({
      emojiPickerOpen: !this.state.emojiPickerOpen,
    });
  };

  componentDidMount() {
    const {
      messageGroups: { active },
      messageComposer: { isOpen },
    } = this.props;
    // if user changes a message group, autofocus the input
    if (active || isOpen) {
      this.setState({
        autofocus: true,
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      messageGroups: { active },
      messageComposer: { isOpen },
    } = this.props;
    // if user changes a message group, autofocus the input
    if (active || isOpen) {
      let textInput = ReactDOM.findDOMNode(this.refs.textInput);
      textInput.focus();
    }
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
    const user = this.props.user;
    const activeStory = this.props.stories.active;
    const activeMessageGroup = this.props.messageGroups.active;

    const file = e.target.files[0];
    const location = activeStory
      ? 'stories'
      : activeMessageGroup ? 'message_groups' : null;
    const key = activeStory || activeMessageGroup;
    const userId = user.uid;

    this.setState({
      mediaUploading: true,
    });

    this.props.dispatch({
      type: 'LOADING',
    });

    uploadMediaToLocation(file, location, key, userId)
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
        this.props.dispatch(throwError(err));
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
      this.props.setLastSeen ? this.props.setLastSeen() : '';
    });
  };

  render() {
    let mobile = isMobile();
    const autofocus = !mobile || this.state.autofocus;

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
            subtle={!this.state.emojiPickerOpen}
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
              autoFocus={autofocus}
            />
            <SendButton onClick={this.sendMessage}>
              <Icon
                icon="send"
                color={
                  !this.state.message ? 'text.placeholder' : 'brand.default'
                }
                static={!this.state.message}
              />
            </SendButton>
          </Form>}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  stories: state.stories,
  messageGroups: state.messageGroups,
  messageComposer: state.messageComposer,
});

export default connect(mapStateToProps)(ChatInput);
