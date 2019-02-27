import React, { Component } from 'react';
import { connect } from 'react-redux';
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

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    if (e.keyCode === ESC) {
      this.closeSlider(e);
    }
  };

  closeSlider = e => {
    e && e.stopPropagation();
    this.props.history.goBack();
  };

  render() {
    const threadId = this.props.match && this.props.match.params.threadId;

    return (
      <ErrorBoundary>
        <div>
          <Transition in={!!threadId} timeout={ANIMATION_DURATION}>
            {state => (
              <div>
                {threadId && (
                  <Container>
                    <div onClick={this.closeSlider}>
                      <Overlay
                        entering={state === 'entering'}
                        entered={state === 'entered'}
                        duration={ANIMATION_DURATION}
                      />
                    </div>
                    <Thread
                      entering={state === 'entering'}
                      entered={state === 'entered'}
                      duration={ANIMATION_DURATION}
                    >
                      <Close onClick={this.closeSlider}>
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
