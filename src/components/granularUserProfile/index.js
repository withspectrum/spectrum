// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { UserHoverProfile } from 'src/components/hoverProfile';
import { UserAvatar } from 'src/components/avatar';
import Link from 'src/components/link';
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
  onlineSize?: 'small' | 'large',
  history: Object,
  dispatch: Dispatch<Object>,
  showHoverProfile?: boolean,
};

// Each prop both provides data AND indicates that the element should be included in the instance of the profile,
// so each instance must manually call out which pieces of the profile it wants included.

const LinkHandler = ({
  username,
  children,
}: {
  username: ?string,
  children: React.Node,
}) => (username ? <Link to={`/users/${username}`}>{children}</Link> : children);

class GranularUserProfileHandler extends React.Component<Props> {
  render() {
    const { showHoverProfile = true, userObject } = this.props;
    return (
      <ConditionalWrap
        condition={showHoverProfile && !!userObject.username}
        wrap={() => (
          <UserHoverProfile
            username={userObject.username}
            style={{ flex: '1 1 auto' }}
          >
            <GranularUserProfile {...this.props} />
          </UserHoverProfile>
        )}
      >
        <GranularUserProfile {...this.props} />
      </ConditionalWrap>
    );
  }
}

class GranularUserProfile extends React.Component<Props> {
  initMessage = () => {
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
      avatarSize,
      badges,
      children,
      messageButton,
      multiAction,
      onlineSize,
      showHoverProfile = true,
    } = this.props;

    return (
      <Row avatarSize={avatarSize} multiAction={multiAction}>
        {profilePhoto && (
          <UserAvatar
            user={userObject}
            size={avatarSize || 32}
            onlineSize={onlineSize || 'small'}
            showHoverProfile={showHoverProfile}
          />
        )}
        <LinkHandler username={userObject.username}>
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
        </LinkHandler>
        {description && <Description>{description}</Description>}
        {messageButton && (
          <MessageIcon
            tipText={name ? `Message ${name}` : 'Message'}
            tipLocation={'top-left'}
            onClick={this.initMessage}
          >
            <Icon glyph="message-new" size={32} />
          </MessageIcon>
        )}
        <Actions>{children}</Actions>
      </Row>
    );
  }
}

export default compose(connect(), withRouter)(GranularUserProfileHandler);
