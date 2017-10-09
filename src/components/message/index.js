import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { openGallery } from '../../actions/gallery';
import { convertTimestampToTime, onlyContainsEmoji } from '../../helpers/utils';
import Reaction from '../reaction';
import { Timestamp, Body, Actions } from './view';
import { Wrapper } from './style';
import { deleteMessage } from '../../api/message';
import { addToastWithTimeout } from '../../actions/toasts';

class Message extends Component {
  componentDidMount() {
    const hash = window.location.hash.substr(1);
    if (hash && hash.length > 1) {
      window.location.href = `#${hash}`;
    }
  }

  toggleOpenGallery = messageId => {
    const { threadId } = this.props;
    this.props.dispatch(openGallery(threadId, messageId));
  };

  toggleMessageFocus = messageId => {
    const { threadId } = this.props;
    // TODO: make it so people can tap/click on messages to set focus and display the message's actions
  };

  deleteMessage = () => {
    this.props
      .deleteMessage(this.props.message.id)
      .then(() => {
        this.props.dispatch(
          addToastWithTimeout('success', 'Message successfully deleted.')
        );
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err.message));
        console.error(err);
      });
  };

  render() {
    const {
      canModerate,
      currentUser,
      dispatch,
      hash,
      imgSrc,
      link,
      me,
      message,
      pending,
      reaction,
      toggleReaction,
      context,
    } = this.props;
    const emojiOnly = onlyContainsEmoji(message.content.body);
    const actionable = context !== 'notification';
    const shareable = message.threadType !== 'directMessageThread';
    const reactable = !emojiOnly && typeof message.id === 'string';
    const hideIndicator = !reactable && !shareable && !canModerate;

    return (
      <Wrapper
        me={me}
        // tipText={convertTimestampToTime(message.timestamp)}
        // tipLocation={'bottom'}
      >
        {shareable && <a name={`${message.id}`} />}
        <Body
          me={me}
          type={emojiOnly ? 'emoji' : message.messageType}
          pending={message.id < 0}
          openGallery={() => this.toggleOpenGallery(message.id)}
          focus={this.toggleMessageFocus}
          message={message.content}
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

export default compose(connect(), deleteMessage)(Message);
