// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserAvatar } from 'src/components/avatar';
import Reputation from 'src/components/reputation';
import Badge from 'src/components/badges';
import Icon from 'src/components/icons';
import Tooltip from 'src/components/tooltip';
import type { Dispatch } from 'redux';
import InitDirectMessageWrapper from 'src/components/initDirectMessageWrapper';
import ConditionalWrap from 'src/components/conditionalWrap';
import {
  Row,
  UserAvatarContainer,
  Content,
  Label,
  Sublabel,
  Description,
  MessageIcon,
  Actions,
} from './style';

type Props = {
  userObject: Object,
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
  children?: React.Node,
  history: Object,
  dispatch: Dispatch<Object>,
  showHoverProfile?: boolean,
  isLink?: boolean,
  onClick?: Function,
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
        <Link to={`/users/${userObject.username}`}>{children}</Link>
      )}
    >
      <Row onClick={() => onClick(userObject)}>
        {profilePhoto && (
          <UserAvatarContainer>
            <UserAvatar
              user={userObject}
              size={avatarSize}
              showHoverProfile={!showHoverProfile}
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
              render={
                <Tooltip content="Send message" placement="top">
                  <MessageIcon>
                    <Icon glyph="message-simple-new" size={24} />
                  </MessageIcon>
                </Tooltip>
              }
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
