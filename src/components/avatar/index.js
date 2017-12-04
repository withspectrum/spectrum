// @flow
import React, { Component } from 'react';
import { optimize } from '../../helpers/images';
import HoverProfile from './hoverProfile';
import AvatarImage from './image';
import { Status, AvatarLink, AvatarNoLink } from './style';

const LinkHandler = props => {
  if (props.link && !props.noLink) {
    return <AvatarLink to={props.link}>{props.children}</AvatarLink>;
  } else {
    return <AvatarNoLink>{props.children}</AvatarNoLink>;
  }
};

type AvatarProps = {
  src: string,
  community?: any,
  user?: any,
  size: string,
  link?: ?string,
  noLink?: boolean,
  showProfile?: boolean,
};
type State = {
  isHovering: boolean,
};
class Avatar extends React.Component<AvatarProps, State> {
  state = { isHovering: false };
  hover = () =>
    this.setState(({ isHovering }) => ({ isHovering: !isHovering }));

  render() {
    const {
      src,
      community,
      user,
      size,
      link,
      noLink,
      showProfile,
    } = this.props;
    const { isHovering } = this.state;

    const optimizedAvatar = optimize(src, {
      w: size,
      dpr: '2',
      format: 'png',
    });
    const communityFallback = '/img/default_community.svg';
    const userFallback = '/img/default_avatar.svg';

    let source;

    if (community && !user) {
      source = [optimizedAvatar, communityFallback];
    } else {
      source = [optimizedAvatar, userFallback];
    }

    return (
      <Status
        size={size || 32}
        {...this.props}
        onMouseEnter={this.hover}
        onMouseLeave={this.hover}
      >
        <LinkHandler {...this.props}>
          <AvatarImage src={source} size={size} community={community} />
        </LinkHandler>
        {showProfile &&
          isHovering && <HoverProfile source={source} {...this.props} />}
      </Status>
    );
  }
}

export default Avatar;
