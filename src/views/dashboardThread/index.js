import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { InboxThreadView } from '../thread';
import { Container, Thread } from './style';

class DashboardThread extends Component {
  render() {
    const { threadId, threadSliderIsOpen } = this.props;

    // no thread has been selected
    if (!threadId) {
      return null;
    }
    // otherwise return the thread that was selected
    return (
      <Container>
        <Thread>
          <InboxThreadView
            threadSliderIsOpen={threadSliderIsOpen}
            threadViewContext={'inbox'}
            threadId={threadId}
            id={threadId}
          />
        </Thread>
      </Container>
    );
  }
}

const map = state => ({ threadSliderIsOpen: state.threadSlider.isOpen });
export default compose(connect(map))(DashboardThread);
