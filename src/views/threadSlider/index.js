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
    this.props.dispatch(openThreadSlider(this.props.match.params.threadId));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
    this.props.dispatch(closeThreadSlider());
  }

  // Sync the currently open thread to the Redux state
  componentDidUpdate(prev) {
    const curr = this.props;

    const prevId = prev.match.params.threadId;
    const currId = curr.match.params.threadId;

    if (prevId !== currId)
      this.props.dispatch(openThreadSlider(this.props.match.params.threadId));
  }

  handleKeyPress = e => {
    if (e.keyCode === ESC) {
      this.closeSlider(e);
    }
  };

  closeSlider = e => {
    e && e.stopPropagation();
    this.props.history.goBack();
    this.props.dispatch(closeThreadSlider());
  };

  render() {
    const { threadId } = this.props.match.params;
    const { threadSlider } = this.props;

    if (!threadSlider.isOpen) return null;

    return (
      <ErrorBoundary>
        <div>
          <Container>
            <div onClick={this.closeSlider}>
              <Overlay entered />
            </div>
            <Thread entered>
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
        </div>
      </ErrorBoundary>
    );
  }
}

const map = state => ({ threadSlider: state.threadSlider });
export default connect(map)(ThreadSlider);
