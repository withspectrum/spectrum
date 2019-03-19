// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CommunityAvatar } from 'src/components/avatar';
import Icon from 'src/components/icons';
import {
  Row,
  CommunityAvatarContainer,
  Content,
  Label,
  Description,
  Actions,
} from './style';

type Props = {
  communityObject: Object,
  id: string,
  avatarSize?: number,
  profilePhoto?: string,
  name?: string,
  description?: ?string,
  children?: React$Node,
};

export const CommunityListItem = (props: Props) => {
  const {
    communityObject,
    profilePhoto,
    name,
    description,
    avatarSize = 32,
    children,
  } = props;

  return (
    <Link to={`/${communityObject.slug}`}>
      <Row avatarSize={avatarSize}>
        {profilePhoto && (
          <CommunityAvatarContainer>
            <CommunityAvatar
              community={communityObject}
              size={avatarSize}
              showHoverProfile={false}
              isClickable={false}
            />
          </CommunityAvatarContainer>
        )}

        <Content>
          {name && <Label>{name}</Label>}

          {description && <Description>{description}</Description>}
        </Content>

        <Actions>
          <Icon glyph="view-forward" size={24} />

          {children}
        </Actions>
      </Row>
    </Link>
  );
};
