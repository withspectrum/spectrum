import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  openThreadSlider,
  closeThreadSlider,
} from '../../actions/threadSlider';
import queryString from 'query-string';
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
import { SliderThreadView } from '../thread';
import { ErrorBoundary } from 'src/components/error';
import { ESC } from 'src/helpers/keycodes';

const ANIMATION_DURATION = 50;

class ThreadSlider extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentDidUpdate(prevProps) {
    const thisParsed = queryString.parse(this.props.location.search);
    const prevParsed = queryString.parse(prevProps.location.search);
    const thisThreadId = thisParsed.thread;
    const prevThreadId = prevParsed.thread;
    if (thisThreadId && !prevThreadId) {
      this.props.dispatch(openThreadSlider());
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
    this.closeSlider();
  }

  handleKeyPress = e => {
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.thread;
    if (!threadId) return;
    if (e.keyCode === ESC) {
      this.closeSlider();
      return this.props.history.push(this.props.location.pathname);
    }
  };

  closeSlider = () => {
    return this.props.dispatch(closeThreadSlider());
  };

  render() {
    const parsed = queryString.parse(this.props.location.search);
    const threadId = parsed.thread;

    return (
      <ErrorBoundary>
        <div>
          <Transition in={!!threadId} timeout={ANIMATION_DURATION}>
            {state => (
              <div>
                {threadId && (
                  <Container>
                    <Link
                      to={this.props.location.pathname}
                      onClick={this.closeSlider}
                    >
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
                      <Close
                        to={this.props.location.pathname}
                        onClick={this.closeSlider}
                      >
                        <CloseLabel>Close</CloseLabel>
                        <CloseButton>
                          <Icon glyph="view-forward" size={24} />
                        </CloseButton>
                      </Close>

                      <SliderThreadView
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
      </ErrorBoundary>
    );
  }
}

export default connect()(ThreadSlider);
