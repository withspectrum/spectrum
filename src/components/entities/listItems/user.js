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
import { OutlineButton } from 'src/components/button';
import {
  RowWithAvatar,
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
  onClick?: (user: UserInfoType) => any,
};

// eslint-disable-next-line
const noop = (user: UserInfoType) => {};

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
      <RowWithAvatar onClick={() => onClick(userObject)}>
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
            <Label title={name}>
              {name}
              {badges &&
                badges.map((b, i) => (
                  <Badge style={{ marginLeft: '8px' }} key={i} type={b} />
                ))}
            </Label>
          )}

          {username && <Sublabel title={username}>@{username}</Sublabel>}

          {typeof reputation === 'number' && (
            // $FlowIssue
            <Reputation reputation={reputation} />
          )}

          {description && <Description>{description}</Description>}
        </Content>

        <Actions>
          {messageButton && (
            <InitDirectMessageWrapper
              user={userObject}
              render={<OutlineButton size={'small'}>Message</OutlineButton>}
            />
          )}

          {children}
        </Actions>
      </RowWithAvatar>
    </ConditionalWrap>
  );
};

export const UserListItem = compose(
  withRouter,
  connect()
)(User);
