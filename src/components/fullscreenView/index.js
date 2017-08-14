// @flow
import React, { Component } from 'react';
import {
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
} from '../../views/homepage/style';
import Icon from '../../components/icons';
import { FullscreenViewContainer, Close } from './style';

class FullscreenView extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    const { close } = this.props;

    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      return close();
    }
  };

  render() {
    const { close, hasBackground, children } = this.props;

    return (
      <FullscreenViewContainer>
        <Close onClick={close}>
          <Icon glyph={'view-close'} size={32} />
        </Close>

        {hasBackground &&
          <span>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
          </span>}

        {children}
      </FullscreenViewContainer>
    );
  }
}

export default FullscreenView;
