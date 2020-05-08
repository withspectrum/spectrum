// @flow
import * as React from 'react';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import AvatarImage from './image';
import { Container, AvatarLink } from './style';
import ConditionalWrap from 'src/components/conditionalWrap';

type Props = {
  community: CommunityInfoType,
  size?: number,
  mobilesize?: number,
  style?: Object,
  showHoverProfile?: boolean,
  isClickable?: boolean,
};

class Avatar extends React.Component<Props> {
  render() {
    const {
      community,
      size = 32,
      isClickable = true,
      mobilesize,
      style,
    } = this.props;

    const src = community.profilePhoto;

    const communityFallback = '/img/default_community.svg';
    const source = [src, communityFallback];

    return (
      <Container
        size={size}
        mobilesize={mobilesize}
        style={style}
        type={'community'}
      >
        <ConditionalWrap
          condition={isClickable}
          wrap={children => (
            <AvatarLink to={`/${community.slug}`}>{children}</AvatarLink>
          )}
        >
          <AvatarImage
            src={source}
            size={size}
            mobilesize={mobilesize}
            type={'community'}
            alt={community.name}
          />
        </ConditionalWrap>
      </Container>
    );
  }
}

class AvatarHandler extends React.Component<Props> {
  render() {
    return <Avatar {...this.props} />;
  }
}

export default AvatarHandler;
