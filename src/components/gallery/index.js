import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { getGalleryForThread } from '../../api/thread';
import { displayLoadingGallery } from '../../components/loading';
import Browser from './browser';

const GalleryWithMedia = compose(getGalleryForThread, displayLoadingGallery)(
  Browser
);

class Gallery extends Component {
  render() {
    const { isOpen, threadId, activeMessageId } = this.props;

    if (isOpen) {
      return (
        <GalleryWithMedia id={threadId} activeMessageId={activeMessageId} />
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
