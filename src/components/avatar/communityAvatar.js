// @flow
import React, { Component } from 'react';
import { optimize } from 'src/helpers/images';
import { CommunityHoverProfile } from 'src/components/hoverProfile';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import AvatarImage from './image';
import { Status, AvatarLink } from './style';
import ConditionalWrap from 'src/components/conditionalWrap';

type Props = {
  community: CommunityInfoType,
  size?: number,
  mobileSize?: number,
  style?: Object,
  showHoverProfile?: boolean,
  clickable?: boolean,
};

export default class AvatarHandler extends Component<Props> {
  render() {
    const { showHoverProfile = true, community } = this.props;

    return (
      <ConditionalWrap
        condition={showHoverProfile}
        wrap={children => (
          <CommunityHoverProfile id={community.id}>
            {children}
          </CommunityHoverProfile>
        )}
      >
        <Avatar {...this.props} />
      </ConditionalWrap>
    );
  }
}

class Avatar extends React.Component<Props> {
  render() {
    const {
      community,
      size = 32,
      clickable = true,
      mobileSize,
      style,
    } = this.props;

    const src = community.profilePhoto;

    const optimizedAvatar =
      src &&
      optimize(src, {
        w: size.toString(),
        dpr: '2',
        format: 'png',
      });
    const communityFallback = '/img/default_community.svg';
    const source = [optimizedAvatar, communityFallback];

    return (
      <Status
        size={size}
        mobileSize={mobileSize}
        style={style}
        type={'community'}
      >
        <ConditionalWrap
          condition={clickable}
          wrap={children => (
            <AvatarLink to={`/${community.slug}`}>{children}</AvatarLink>
          )}
        >
          <AvatarImage
            src={source}
            size={size}
            mobileSize={mobileSize}
            type={'community'}
          />
        </ConditionalWrap>
      </Status>
    );
  }
}
