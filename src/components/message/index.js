import React, { Component } from 'react';
import { openGallery } from '../../actions/gallery';
import { convertTimestampToTime, onlyContainsEmoji } from '../../helpers/utils';
import Reaction from '../reaction';
import { Timestamp, Body, Actions } from './view';
import { Wrapper } from './style';

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

  deleteMessage = messageId => {
    //@mxstbr: get all up in here...
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
    } = this.props;
    const emojiOnly = onlyContainsEmoji(message.content.body);
    const shareable = message.messageType !== 'directMessageThread';

    return (
      <Wrapper
        me={me}
        tipText={convertTimestampToTime(message.timestamp)}
        tipLocation={me ? 'bottom-left' : 'bottom-right'}
      >
        {shareable && <a name={`${message.id}`} />}
        <Body
          type={emojiOnly ? 'emoji' : message.messageType}
          pending={message.id < 0}
          openGallery={this.toggleOpenGallery}
          focus={this.toggleMessageFocus}
          message={message.content}
        />
        <Actions
          me={me}
          shareable={shareable}
          currentUser={currentUser}
          canModerate={canModerate}
          deleteMessage={this.deleteMessage}
        >
          {!emojiOnly &&
          message.messageType !== 'media' &&
          typeof message.id === 'string' && (
            <Reaction
              message={message}
              toggleReaction={toggleReaction}
              me={me}
              currentUser={currentUser}
              dispatch={dispatch}
            />
          )}
        </Actions>
      </Wrapper>
    );
  }
}

export default Message;
