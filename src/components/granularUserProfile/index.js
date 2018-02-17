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
import { addProtocolToString } from '../../helpers/utils';
import {
  Row,
  Content,
  MetaContent,
  AvatarContent,
  NameContent,
  Name,
  Username,
  BadgeContent,
  Description,
  Website,
  MessageIcon,
  Actions,
} from './style';

type Props = {
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
  children?: React.Node,
  isOnline?: boolean,
  onlineSize?: 'small' | 'large',
  history: Object,
  dispatch: Function,
};

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
      avatarSize,
      profilePhoto,
      name,
      username,
      description,
      website,
      badges,
      reputation,
      children,
      messageButton,
      isOnline,
      onlineSize,
    } = this.props;

    return (
      <Row>
        <Content>
          {profilePhoto && (
            <AvatarContent>
              <Avatar
                src={profilePhoto}
                size={avatarSize || '32'}
                isOnline={isOnline}
                onlineSize={onlineSize}
              />
            </AvatarContent>
          )}

          <MetaContent>
            {name && (
              <NameContent>
                <LinkHandler username={username}>
                  <Name>{name}</Name>
                </LinkHandler>

                {username && (
                  <LinkHandler username={username}>
                    <Username>@{username}</Username>
                  </LinkHandler>
                )}

                {badges && (
                  <BadgeContent>
                    {badges.map((b, i) => <Badge key={i} type={b} />)}
                  </BadgeContent>
                )}
              </NameContent>
            )}

            {typeof reputation === 'number' && (
              <Reputation reputation={reputation} />
            )}

            {description && <Description>{description}</Description>}

            {website && (
              <Website>
                <a href={addProtocolToString(website)} target={'_blank'}>
                  {website}
                </a>
              </Website>
            )}
          </MetaContent>

          <Actions>
            {messageButton && (
              <MessageIcon
                tipText={name ? `Message ${name}` : 'Message'}
                tipLocation={'top-left'}
                onClick={this.initMessage}
              >
                <Icon glyph="message-new" size={32} />
              </MessageIcon>
            )}

            {children}
          </Actions>
        </Content>
      </Row>
    );
  }
}

export default compose(connect(), withRouter)(GranularUserProfile);
