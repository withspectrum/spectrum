// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserHoverProfile } from 'src/components/hoverProfile';
import { UserAvatar } from 'src/components/avatar';
import { Link } from 'react-router-dom';
import Reputation from 'src/components/reputation';
import Badge from 'src/components/badges';
import Icon from 'src/components/icons';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import type { Dispatch } from 'redux';
import ConditionalWrap from 'src/components/conditionalWrap';
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
      <Row
        to={`/users/${userObject.username}`}
        avatarSize={avatarSize}
        multiAction={multiAction}
      >
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
            <MessageIcon
              tipText={'Send message'}
              tipLocation={'left'}
              onClick={this.initMessage}
            >
              <Icon glyph="message-simple-new" size={24} />
            </MessageIcon>
          )}

          {children}
        </Actions>
      </Row>
    );
  }
}

export default compose(
  connect(),
  withRouter
)(GranularUserProfileHandler);
