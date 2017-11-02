import React, { Component } from 'react';
// $FlowFixMe
import queryString from 'query-string';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Transition from 'react-transition-group/Transition';
import {
  Container,
  Overlay,
  Thread,
  Close,
  CloseButton,
  CloseLabel,
} from './style';
import Icon from '../../components/icons';
import ThreadContainer from '../thread';

const ANIMATION_DURATION = 50;

class ThreadSlider extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    // if user presses esc
    if (e.keyCode === 27) {
      return this.props.history.push(this.props.location.pathname);
    }
  };

  render() {
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.thread;

    return (
      <div>
        <Transition in={!!threadId} timeout={ANIMATION_DURATION}>
          {state => (
            <div>
              {threadId && (
                <Container>
                  <Link to={this.props.location.pathname}>
                    <Overlay
                      entering={state === 'entering'}
                      entered={state === 'entered'}
                      duration={ANIMATION_DURATION}
                    />
                  </Link>
                  <Thread
                    entering={state === 'entering'}
                    entered={state === 'entered'}
                    duration={ANIMATION_DURATION}
                  >
                    <Close to={this.props.location.pathname}>
                      <CloseLabel>Close</CloseLabel>
                      <CloseButton>
                        <Icon glyph="view-forward" size={24} />
                      </CloseButton>
                    </Close>

                    <ThreadContainer
                      threadId={threadId}
                      threadViewContext={'slider'}
                      slider
                    />
                  </Thread>
                </Container>
              )}
            </div>
          )}
        </Transition>
      </div>
    );
  }
}

export default ThreadSlider;
