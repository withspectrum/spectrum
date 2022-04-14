// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { CommunityAvatar } from 'src/components/avatar';
import Icon from 'src/components/icon';
import {
  RowWithAvatar,
  CommunityAvatarContainer,
  Content,
  Label,
  Description,
  Actions,
} from './style';

type Props = {
  communityObject: Object,
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
      <RowWithAvatar>
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
          {name && <Label title={name}>{name}</Label>}

          {description && <Description>{description}</Description>}
        </Content>

        <Actions>
          <Icon glyph="view-forward" size={24} />

          {children}
        </Actions>
      </RowWithAvatar>
    </Link>
  );
};
