import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { fromJS } from 'immutable';
import { sendMessage } from '../../../../actions/messages';
import { uploadMedia } from '../../../../helpers/stories';
import { isMobile } from '../../../../helpers/utils';
import EmojiPicker from '../../../../shared/EmojiPicker';
import Icon from '../../../../shared/Icons';
import { EditorState, Modifier, convertToRaw, ContentState } from 'draft-js';
import { connect } from 'react-redux';
import { track } from '../../../../EventTracker';
import {
  Input,
  InputWrapper,
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
      editorState: EditorState.createEmpty(),
      file: '',
      emojiPickerOpen: false,
      mediaUploading: false,
    };
  }

  editMessage = editorState => {
    this.setState({
      editorState,
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

    this.focusInput();
    this.setState(({ editorState }) => {
      // Append emoji to text
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      const newContent = Modifier.insertText(contentState, selection, emoji);
      return {
        emojiPickerOpen: false,
        editorState: EditorState.push(
          editorState,
          newContent,
          'insert-fragment',
        ),
      };
    });
  };

  sendMessage = e => {
    e && e.preventDefault();
    let messageObj = {
      type: 'draft-js',
      // NOTE (@mxstbr): The fromJS().toJS() part is necessary as there are undefined values deep
      // inside the immutable object otherwise, which Firebase spits an error out on
      content: fromJS(
        convertToRaw(this.state.editorState.getCurrentContent()),
      ).toJS(),
    };

    this.dispatchMessage(messageObj);
    this.clearInput();
  };

  clearInput = () => {
    const editorState = EditorState.push(
      this.state.editorState,
      ContentState.createFromText(''),
    );

    this.setState({
      editorState,
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
    // the current user has sent a message, so force the parent to scroll to bottom
    this.props.forceScrollToBottom();

    this.props.dispatch(sendMessage(message));
  };

  focusInput = () => {
    this.input.focus();
  };

  handleReturn = e => {
    // This is a workaround so we don't send a message when users just want to
    // select a mention. Didn't find a nicer way to do that!
    const mentionSuggestionPopup = document.querySelector(
      '.draftJsMentionPlugin__mentionSuggestions__2DWjA',
    );

    if (!mentionSuggestionPopup) {
      this.sendMessage();
      return true;
    }
    // NOTE (@mxstbr): Newest version of draft-js uses 'handled' and 'not-handled' instead of
    // true/false. Will need to change when we upgrade.
    return false;
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
            onChange={this.appendEmoji}
            closePicker={this.toggleEmojiPicker}
          />}
        <EmojiToggle
          active={this.state.emojiPickerOpen}
          onClick={this.toggleEmojiPicker}
        >
          😀
        </EmojiToggle>
        {this.props.user.uid &&
          <InputWrapper onClick={this.focusInput}>
            <Input
              singleLine
              placeholder="Your message here..."
              editorRef={elem => this.input = elem}
              editorState={this.state.editorState}
              onChange={this.editMessage}
              handleReturn={this.handleReturn}
            />
            <Button onClick={this.sendMessage}>
              <Icon icon="send" reverse static />
            </Button>
          </InputWrapper>}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  stories: state.stories,
});

export default connect(mapStateToProps)(ChatInput);
