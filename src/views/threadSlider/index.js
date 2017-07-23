//@flow
import React, { Component } from 'react';
// $FlowFixMe
import queryString from 'query-string';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  Container,
  Overlay,
  Thread,
  Close,
  CloseButton,
  CloseLabel,
} from './style';
import Icon from '../../components/icons';
import ThreadContainer from '../thread/containers';

class ThreadSlider extends Component {
  close = () => {};
  render() {
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.thread;

    if (!threadId) return null;
    return (
      <Container>
        <Link to={this.props.location.pathname}>
          <Overlay />
        </Link>
        <Thread>
          <Close to={this.props.location.pathname}>
            <CloseButton>
              <Icon glyph="view-back" size={24} />
            </CloseButton>
            <CloseLabel>Close</CloseLabel>
          </Close>

          <ThreadContainer threadId={threadId} slider />
        </Thread>
      </Container>
    );
  }
}

export default ThreadSlider;
