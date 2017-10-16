import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import { getMediaMessagesForThread } from '../../api/message';
import { displayLoadingGallery } from '../../components/loading';
import Browser from './browser';

const GalleryWithMedia = compose(
  getMediaMessagesForThread,
  displayLoadingGallery
)(Browser);

class Gallery extends Component {
  render() {
    const { isOpen, threadId, activeMessageId } = this.props;

    if (isOpen) {
      return (
        <GalleryWithMedia
          threadId={threadId}
          activeMessageId={activeMessageId}
        />
      );
    } else {
      return <span />;
    }
  }
}

const mapStateToProps = state => ({
  threadId: state.gallery.threadId,
  activeMessageId: state.gallery.messageId,
  isOpen: state.gallery.isOpen,
});

export default compose(connect(mapStateToProps))(Gallery);
