import React, { Component } from 'react';
import { openGallery } from '../../actions/gallery';
import { convertTimestampToTime } from '../../helpers/utils';
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

  render() {
    const {
      imgSrc,
      message,
      link,
      reaction,
      toggleReaction,
      me,
      shareable,
      canModerate,
      hash,
      pending,
    } = this.props;

    return (
      <Wrapper>
        {shareable && <a name={`${message.id}`} />}
        <Timestamp time={convertTimestampToTime(message.timestamp)} />
        <Body
          type={message.messageType}
          pending={message.id < 0}
          hash={hash}
          action={this.toggleOpenGallery}
          message={message.content}
        />
        <Actions
          me={me}
          reaction={reaction}
          shareable={shareable}
          canModerate={canModerate}
        />
      </Wrapper>
    );
  }
}

export default Message;
