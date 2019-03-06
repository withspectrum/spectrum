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
import Tooltip from 'src/components/Tooltip';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import type { Dispatch } from 'redux';
import {
  Row,
  Name,
  Username,
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
};

class GranularUserProfileHandler extends React.Component<Props> {
  render() {
    return <GranularUserProfile {...this.props} />;
  }
}

class GranularUserProfile extends React.Component<Props> {
  initMessage = (e: any) => {
    e && e.preventDefault() && e.stopPropagation();
    const { name, username, id } = this.props;
    const user = { name, username, id };

    this.props.dispatch(initNewThreadWithUser(user));
    this.props.history.push('/messages/new');
  };

  render() {
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
      multiAction,
      showHoverProfile = true,
    } = this.props;

    // TODO @brian: decide whether we want to render users without a username at all
    if (!userObject.username) return null;

    return (
      <Link to={`/users/${userObject.username}`}>
        <Row avatarSize={avatarSize} multiAction={multiAction}>
          {profilePhoto && (
            <UserAvatar
              user={userObject}
              size={avatarSize}
              showHoverProfile={!showHoverProfile}
              isClickable={false}
            />
          )}

          {name && (
            <Name>
              {name}
              {username && <Username>@{username}</Username>}
              {badges && badges.map((b, i) => <Badge key={i} type={b} />)}
            </Name>
          )}

          {typeof reputation === 'number' && (
            <Reputation reputation={reputation} />
          )}

          {description && <Description>{description}</Description>}

          <Actions>
            {messageButton && (
              <Tooltip title="Send message" position="top">
                <MessageIcon onClick={this.initMessage}>
                  <Icon glyph="message-simple-new" size={24} />
                </MessageIcon>
              </Tooltip>
            )}

            {children}
          </Actions>
        </Row>
      </Link>
    );
  }
}

export default compose(
  connect(),
  withRouter
)(GranularUserProfileHandler);
