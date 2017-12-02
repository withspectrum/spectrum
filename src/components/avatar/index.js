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

const Avatar = (props: AvatarProps) => {
  const { src, community, user, size, link, noLink, showProfile } = props;

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
    <Status size={size || 32} {...props}>
      <LinkHandler>
        <AvatarImage src={source} size={size} community={community} />
      </LinkHandler>
      {showProfile && <HoverProfile source={source} {...props} />}
    </Status>
  );
};

export default Avatar;
