// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getMediaMessagesForThread from 'shared/graphql/queries/message/getMediaMessagesForThread';
import { displayLoadingGallery } from 'src/components/loading';
import Browser from './browser';

const GalleryWithMedia = compose(
  getMediaMessagesForThread,
  displayLoadingGallery
)(Browser);

type Props = {
  isOpen: boolean,
  threadId: string,
  activeMessageId: string,
};

class Gallery extends React.Component<Props> {
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
      return null;
    }
  }
}

const mapStateToProps = state => ({
  threadId: state.gallery.threadId,
  activeMessageId: state.gallery.messageId,
  isOpen: state.gallery.isOpen,
});

export default compose(
  // $FlowIssue
  connect(mapStateToProps)
)(Gallery);
