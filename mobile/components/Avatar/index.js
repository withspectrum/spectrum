// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import TouchableHighlight from '../TouchableHighlight';

import ConditionalWrap from '../ConditionalWrap';
import { AvatarImage } from './style';

type AvatarProps = {
  src: string,
  size: number,
  variant?: 'square' | 'circle',
  onPress?: Function,
  style?: Object,
};

class Avatar extends Component<AvatarProps> {
  shouldComponentUpdate(nextProps: AvatarProps) {
    const currProps = this.props;
    if (nextProps.src !== currProps.src) return true;
    return false;
  }

  render() {
    const { src, size, onPress, style, variant = 'circle' } = this.props;
    let source = src ? { uri: src } : {};

    return (
      <ConditionalWrap
        condition={!!onPress}
        wrap={children => (
          <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
        )}
      >
        <AvatarImage
          source={source}
          size={size}
          style={style}
          radius={variant === 'circle' ? size / 2 : size / 4}
        />
      </ConditionalWrap>
    );
  }
}

export default compose(withNavigation)(Avatar);
