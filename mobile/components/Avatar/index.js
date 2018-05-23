// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import { TouchableHighlight } from 'react-native';

import ConditionalWrap from '../ConditionalWrap';
import { AvatarImage } from './style';

type AvatarProps = {|
  src: string,
  size: number,
  radius: number,
  onPress?: Function,
  style?: Object,
|};

class Avatar extends Component<AvatarProps> {
  render() {
    const { src, size, radius, onPress, style } = this.props;
    let source = src ? { uri: src } : {};

    return (
      <ConditionalWrap
        condition={!!onPress}
        wrap={children => (
          <TouchableHighlight onPress={onPress}>{children}</TouchableHighlight>
        )}
      >
        <AvatarImage source={source} size={size} radius={radius} style={style} />
      </ConditionalWrap>
    );
  }
}

export default compose(withNavigation)(Avatar);
