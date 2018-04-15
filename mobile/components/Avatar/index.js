// @flow
import React, { Component } from 'react';
import { AvatarImage } from './style';

type AvatarProps = {
  src: string,
  size: number,
  radius: number,
};

export default class Avatar extends Component<AvatarProps> {
  render() {
    const { src, size, radius } = this.props;
    let source = src ? { uri: src } : {};

    return <AvatarImage source={source} size={size} radius={radius} />;
  }
}
