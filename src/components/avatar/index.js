// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Link from 'src/components/link';
import { withRouter } from 'react-router';
import { zIndex } from '../globals';
import { Card } from '../card';
import Reputation from '../reputation';
import Icon from '../icons';
import Badge from '../badges';
import { optimize } from '../../helpers/images';
import { addProtocolToString } from '../../helpers/utils';
import HoverProfile from './hoverProfile';
import AvatarImage from './image';
import { Status, AvatarLink } from './style';

const Avatar = (props: Object): React$Element<any> => {
  const { src, community, user, size, link, noLink, showProfile } = props;

  const optimizedAvatar = optimize(src, { w: size, dpr: '2', format: 'png' });
  const communityFallback = '/img/default_community.svg';
  const userFallback = '/img/default_avatar.svg';

  let source;

  if (community && !user) {
    source = [optimizedAvatar, communityFallback];
  } else {
    source = [optimizedAvatar, userFallback];
  }

  if (!src || !source) {
    return null;
  } else {
    return (
      <Status size={size || 32} {...props}>
        {link && !noLink ? (
          <AvatarLink to={link}>
            <AvatarImage src={source} size={size} />
          </AvatarLink>
        ) : (
          <AvatarImage src={source} />
        )}
        {showProfile && <HoverProfile source={source} {...props} />}
      </Status>
    );
  }
};

export default Avatar;
