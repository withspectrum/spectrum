// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import { UserAvatar } from 'src/components/avatar';
import Reputation from 'src/components/reputation';
import Badge from 'src/components/badges';
import type { Dispatch } from 'redux';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import ConditionalWrap from 'src/components/conditionalWrap';
import { SmallOutlineButton } from 'src/views/community/components/button';
import {
  Row,
  UserAvatarContainer,
  Content,
  Label,
  Sublabel,
  Description,
  Actions,
  CardLink,
} from './style';

type Props = {
  userObject: UserInfoType,
  id: string,
  avatarSize?: number,
  profilePhoto?: string,
  name?: string,
  username?: ?string,
  description?: ?string,
  website?: ?string,
  badges?: Array<string>,
  isCurrentUser?: boolean,
  reputation?: number,
  messageButton?: boolean,
  multiAction?: boolean,
  children?: React$Node,
  history: Object,
  dispatch: Dispatch<Object>,
  showHoverProfile?: boolean,
  isLink?: boolean,
  onClick?: Function<UserInfoType>,
};

const noop = () => {};

const User = (props: Props) => {
  const {
    userObject,
    profilePhoto,
    name,
    username,
    description,
    reputation,
    avatarSize = 40,
    badges,
    children,
    messageButton,
    showHoverProfile = true,
    isLink = true,
    onClick = noop,
  } = props;

  if (!userObject.username) return null;

  return (
    <ConditionalWrap
      condition={isLink}
      wrap={children => (
        <CardLink to={`/users/${userObject.username}`}>{children}</CardLink>
      )}
    >
      <Row onClick={() => onClick(userObject)}>
        {profilePhoto && (
          <UserAvatarContainer>
            <UserAvatar
              user={userObject}
              size={avatarSize}
              showHoverProfile={showHoverProfile}
              isClickable={false}
            />
          </UserAvatarContainer>
        )}

        <Content>
          {name && (
            <Label>
              {name}
              {badges && badges.map((b, i) => <Badge key={i} type={b} />)}
            </Label>
          )}

          {username && <Sublabel>@{username}</Sublabel>}

          {typeof reputation === 'number' && (
            <Reputation reputation={reputation} />
          )}

          {description && <Description>{description}</Description>}
        </Content>

        <Actions>
          {messageButton && (
            <InitDirectMessageWrapper
              user={userObject}
              render={<SmallOutlineButton>Message</SmallOutlineButton>}
            />
          )}

          {children}
        </Actions>
      </Row>
    </ConditionalWrap>
  );
};

export const UserListItem = compose(
  withRouter,
  connect()
)(User);
