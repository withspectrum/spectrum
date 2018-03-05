// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { withRouter } from 'react-router';
import Reputation from '../reputation';
import Icon from '../icons';
import Badge from '../badges';
import { Button } from '../buttons';
import addProtocolToString from 'shared/normalize-url';
import { Card } from '../card';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
import AvatarImage from './image';
import {
  Container,
  CoverLink,
  CoverPhoto,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  ExtLink,
  MessageButtonContainer,
} from '../profile/style';
import { HoverWrapper } from './style';

type ProfileProps = {
  user: Object,
  community: ?Object,
  dispatch: Function,
  source: string,
  currentUser: ?Object,
  top: ?Boolean,
  left: ?Boolean,
  bottom: ?Boolean,
  right: ?Boolean,
};

class HoverProfile extends Component<ProfileProps> {
  initMessage = (dispatch, user) => {
    dispatch(initNewThreadWithUser(user));
  };

  render() {
    const { user, community, dispatch, source, currentUser } = this.props;

    if (community) {
      return (
        <HoverWrapper
          top={this.props.top ? true : this.props.bottom ? false : true}
          bottom={this.props.bottom}
          right={this.props.right ? true : this.props.left ? false : true}
          left={this.props.left}
        >
          <Container>
            <CoverPhoto url={community.coverPhoto} />
            <CoverLink to={`/${community.slug}`}>
              <AvatarImage
                src={source}
                size="64"
                style={{ boxShadow: '0 0 0 2px white', zIndex: '2' }}
              />
              <CoverTitle>{community.name}</CoverTitle>
            </CoverLink>
            <CoverSubtitle>
              {community.metaData.members.toLocaleString()} members
            </CoverSubtitle>

            <CoverDescription>{community.description}</CoverDescription>
          </Container>
        </HoverWrapper>
      );
    }

    if (user) {
      return (
        <HoverWrapper
          top={this.props.top ? true : this.props.bottom ? false : true}
          bottom={this.props.bottom}
          right={this.props.right ? true : this.props.left ? false : true}
          left={this.props.left}
        >
          <Card
            style={{
              boxShadow: '0 4px 8px rgba(18, 22, 23, .25)',
              borderRadius: '16px',
            }}
          >
            <CoverPhoto url={user.coverPhoto} />
            <CoverLink to={`/users/${user.username}`}>
              <AvatarImage
                src={source}
                size="64"
                style={{ boxShadow: '0 0 0 2px white', zIndex: '2' }}
              />
              <CoverTitle>{user.name}</CoverTitle>
            </CoverLink>
            <CoverSubtitle center>
              @{user.username}
              {user.isPro && <Badge type="pro" />}
              <Reputation
                tipText={'Total rep across all communities'}
                size={'large'}
                reputation={
                  user.contextPermissions
                    ? user.contextPermissions.reputation
                    : user.totalReputation
                }
              />
            </CoverSubtitle>

            {(user.description || user.website) && (
              <CoverDescription>
                {user.description && <p>{user.description}</p>}
                {user.website && (
                  <ExtLink>
                    <Icon glyph="link" size={24} />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={addProtocolToString(user.website)}
                    >
                      {user.website}
                    </a>
                  </ExtLink>
                )}
              </CoverDescription>
            )}

            {currentUser &&
              user &&
              currentUser.id !== user.id && (
                <MessageButtonContainer>
                  <Link
                    to={'/messages/new'}
                    onClick={() => this.initMessage(dispatch, user)}
                  >
                    <Button>Message</Button>
                  </Link>
                </MessageButtonContainer>
              )}
          </Card>
        </HoverWrapper>
      );
    }

    return null;
  }
}

const map = state => ({ currentUser: state.users.currentUser });

//$FlowFixMe
export default compose(connect(map), withRouter)(HoverProfile);
