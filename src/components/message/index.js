import React, { Component } from 'react';
import { openGallery } from '../../actions/gallery';
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

  renderMarkdownLinks = text => {
    return replace(text, MARKDOWN_LINK, (fullLink, text, url) => (
      <a href={url} target="_blank" rel="noopener nofollower">
        {text}
      </a>
    ));
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
      <MessageWrapper>
        {shareable && <a name={`${message.id}`} />}
        <MessageTimestamp time={convertTimestampToTime(message.timestamp)} />
        <MessageBody
          type={message.type}
          imgSrc={imgSrc}
          pending={message.id < 0}
          hash={hash}
          action={toggleOpenGallery}
          message={message}
        />
        <MessageActions
          me={me}
          reaction={reaction}
          shareable={shareable}
          canModerate={canModerate}
        />
      </MessageWrapper>
    );
  }
}
