// @flow
import React, { Component } from 'react';
import {
  ClusterOne,
  ClusterTwo,
  ClusterThree,
  ClusterFour,
} from 'src/components/illustrations';
import Icon from 'src/components/icon';
import { FullscreenViewContainer, Illustrations, CloseLink } from './style';
import { ESC } from 'src/helpers/keycodes';

type Props = {
  closePath: string,
  children: any,
};

class FullscreenView extends Component<Props> {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = (e: any) => {
    const { closePath } = this.props;
    // if person taps esc, close the dialog
    if (closePath && e.keyCode === ESC) {
      return (window.location = closePath);
    }
  };

  render() {
    const { closePath, children } = this.props;

    return (
      <FullscreenViewContainer>
        <CloseLink href={closePath}>
          <Icon glyph={'view-close'} size={32} />
        </CloseLink>

        <Illustrations>
          <ClusterOne src="/img/cluster-2.svg" role="presentation" />
          <ClusterTwo src="/img/cluster-1.svg" role="presentation" />
          <ClusterThree src="/img/cluster-5.svg" role="presentation" />
          <ClusterFour src="/img/cluster-4.svg" role="presentation" />
        </Illustrations>

        {children}
      </FullscreenViewContainer>
    );
  }
}

export default FullscreenView;
