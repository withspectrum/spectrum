// @flow
import React, { Component } from 'react';
import { optimize } from './utils';
import AvatarImage from './image';
import { Status } from './style';

type AvatarProps = {
  src: string,
  community?: any,
  user?: any,
  size: number,
  link?: ?string,
  noLink?: boolean,
};

export default class Avatar extends Component<AvatarProps> {
  render() {
    const { src, community, user, size } = this.props;

    // $FlowFixMe
    const optimizedAvatar = optimize(src, {
      w: size,
      dpr: '2',
      format: 'png',
    });

    const communityFallback = './img/default_community.svg';
    const userFallback = './img/default_avatar.svg';

    let source;

    if (community && !user) {
      source = [optimizedAvatar, communityFallback];
    } else {
      source = [optimizedAvatar, userFallback];
    }

    return (
      <Status size={size || 32} {...this.props}>
        <AvatarImage src={source} size={size} community={community} />
      </Status>
    );
  }
}
