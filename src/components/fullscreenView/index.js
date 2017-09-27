import React, { Component } from 'react';
import {
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
} from '../../views/splash/components/illustrations';
import Icon from '../../components/icons';
import { FullscreenViewContainer, Illustrations, Close } from './style';

class FullscreenView extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    const { close, noCloseButton } = this.props;

    // if we don't want the user to close the onboarding flow - when they
    // are setting a username - ignore esc key presses
    if (noCloseButton) return;

    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      return close();
    }
  };

  render() {
    const { close, hasBackground, children, noCloseButton } = this.props;

    return (
      <FullscreenViewContainer>
        {!noCloseButton && (
          <Close onClick={close}>
            <Icon glyph={'view-close'} size={32} />
          </Close>
        )}

        {hasBackground && (
          <Illustrations>
            <ClusterOne src="/img/cluster-2.svg" role="presentation" />
            <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
            <ClusterThree src="/img/cluster-5.svg" role="presentation" />
            <ClusterFour src="/img/cluster-4.svg" role="presentation" />
          </Illustrations>
        )}

        {children}
      </FullscreenViewContainer>
    );
  }
}

export default FullscreenView;
