// @flow
import React, { Component } from 'react';
import { AvatarImage } from './style';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import { TouchableHighlight } from 'react-native';

type AvatarProps = {
  src: string,
  size: number,
  radius: number,
  navigate?: Function,
};

class Avatar extends Component<AvatarProps> {
  render() {
    const { src, size, radius, navigate } = this.props;
    let source = src ? { uri: src } : {};

    if (navigate) {
      return (
        <TouchableHighlight onPress={() => navigate()}>
          <AvatarImage source={source} size={size} radius={radius} />
        </TouchableHighlight>
      );
    }

    return <AvatarImage source={source} size={size} radius={radius} />;
  }
}

export default compose(withNavigation)(Avatar);
