// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Avatar from '../avatar';
import Link from '../link';
import Reputation from '../reputation';
import Badge from '../badges';
import Icon from '../icons';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
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
  avatarSize?: string,
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
  dispatch: Function,
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
    } = this.props;

    return (
      <Row avatarSize={avatarSize} multiAction={multiAction}>
        {profilePhoto && (
          <Avatar
            src={profilePhoto}
            size={avatarSize || '32'}
            isOnline={userObject.isOnline}
            onlineSize={onlineSize || 'small'}
            link={`/users/${userObject.username}`}
          />
        )}
        <LinkHandler username={userObject.username}>
          <span>
            {name && (
              <Name>
                {name}
                {username && <Username>@{username}</Username>}
              </Name>
            )}
            {badges && badges.map((b, i) => <Badge key={i} type={b} />)}
          </span>

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

export default compose(connect(), withRouter)(GranularUserProfile);
