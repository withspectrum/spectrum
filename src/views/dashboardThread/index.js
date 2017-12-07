import React, { Component } from 'react';
import Composer from '../../components/composer';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import ThreadContainer from '../thread';
import { Container, Thread } from './style';

class DashboardThread extends Component {
  render() {
    const { threadId, threadSliderIsOpen } = this.props;

    // no thread has been selected
    if (!threadId) return null;

    // composer is selected
    if (threadId === 'new')
      return (
        <Container>
          <Thread>
            <Composer isInbox={true} {...this.props} />
          </Thread>
        </Container>
      );

    // otherwise return the thread that was selected
    return (
      <Container>
        <Thread>
          <ThreadContainer
            threadSliderIsOpen={threadSliderIsOpen}
            threadViewContext={'inbox'}
            threadId={threadId}
          />
        </Thread>
      </Container>
    );
  }
}

const map = state => ({ threadSliderIsOpen: state.threadSlider.isOpen });
export default compose(connect(map))(DashboardThread);
