import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openGallery } from '../../actions/gallery';
import { onlyContainsEmoji } from '../../helpers/utils';
import Reaction from '../reaction';
import { Body, Actions } from './view';
import { Wrapper } from './style';
import { openModal } from '../../actions/modals';
import { toPlainText, toState, toJson } from 'shared/draft-utils';

class Message extends Component {
  constructor() {
    super();

    const hash = window.location.hash.substr(1);

    let initialSelection = null;

    if (hash && hash.length > 1) {
      initialSelection = hash;
    }

    this.state = {
      selectedMessage: initialSelection,
    };
  }

  toggleSelectedMessage = messageId => {
    if (this.state.selectedMessage === messageId) {
      this.setState({
        selectedMessage: null,
      });
    } else {
      this.setState({
        selectedMessage: messageId,
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const newMessage = nextProps.message.id !== this.props.message.id;
    const newSelection =
      nextState.selectedMessage !== this.state.selectedMessage;

    if (newMessage || newSelection) {
      return true;
    } else {
      return false;
    }
  }

  toggleOpenGallery = messageId => {
    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, messageId));
  };

  deleteMessage = () => {
    const message = `Are you sure you want to delete this message?`;

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: this.props.message.id,
        entity: 'message',
        message,
        threadType: this.props.threadType,
        threadId: this.props.threadId,
      })
    );
  };

  render() {
    const {
      canModerate,
      currentUser,
      dispatch,
      me,
      message,
      reaction,
      toggleReaction,
      context,
      selected,
    } = this.props;

    const { selectedMessage } = this.state;
    const parsedMessage =
      message.messageType &&
      message.messageType === 'draftjs' &&
      toPlainText(toState(JSON.parse(message.content.body)));
    const emojiOnly = parsedMessage && onlyContainsEmoji(parsedMessage);
    const actionable = context !== 'notification';
    const shareable = message.threadType !== 'directMessageThread';
    const reactable = !emojiOnly && typeof message.id === 'string';
    const hideIndicator = !reactable && !shareable && !canModerate;

    return (
      <Wrapper
        me={me}
        selected={selectedMessage === message.id}
        onClick={() => this.toggleSelectedMessage(message.id)}
      >
        <Body
          id={message.id}
          me={me}
          type={emojiOnly ? 'emoji' : message.messageType}
          pending={message.id < 0}
          openGallery={() => this.toggleOpenGallery(message.id)}
          message={emojiOnly ? parsedMessage : message.content}
        />
        {actionable && (
          <Actions
            me={me}
            shareable={shareable}
            currentUser={currentUser}
            canModerate={canModerate}
            deleteMessage={this.deleteMessage}
            hideIndicator={hideIndicator}
          >
            {reaction &&
              reactable && (
                <Reaction
                  message={message}
                  toggleReaction={toggleReaction}
                  me={me}
                  currentUser={currentUser}
                  dispatch={dispatch}
                  reaction={reaction}
                />
              )}
          </Actions>
        )}
      </Wrapper>
    );
  }
}

export default compose(connect())(Message);
