// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import styled from 'styled-components';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { withRouter } from 'react-router';
import { zIndex } from '../globals';
import { Card } from '../card';
import Reputation from '../reputation';
import Icon from '../icons';
import Badge from '../badges';
import { optimize } from '../../helpers/images';
import { addProtocolToString } from '../../helpers/utils';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
import {
  Container,
  CoverLink,
  CoverPhoto,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  ExtLink,
  ReputationContainer,
} from '../profile/style';
import {
  StyledAvatarFallback,
  HoverWrapper,
  StyledAvatarStatus,
  StyledAvatar,
  StyledAvatarLink,
  CoverAction,
} from './style';

type ProfileProps = {
  user: Object,
  community: ?Object,
  showProfile: ?boolean,
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
    const {
      user,
      community,
      showProfile,
      dispatch,
      source,
      currentUser,
    } = this.props;

    if (showProfile && (community || user)) {
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
                <StyledAvatar
                  data={optimize(source, { w: '64', dpr: '2', format: 'png' })}
                  type="image/png"
                  size={64}
                  {...this.props}
                  style={{
                    boxShadow: '0 0 0 2px #fff',
                    flex: '0 0 64px',
                    width: '64px',
                    height: '64px',
                    marginRight: '0',
                  }}
                >
                  <StyledAvatarFallback
                    {...this.props}
                    src={
                      community
                        ? `/img/default_community.svg`
                        : `/img/default_avatar.svg`
                    }
                  />
                </StyledAvatar>
                <CoverTitle>{community.name}</CoverTitle>
              </CoverLink>
              <CoverSubtitle>
                {community.metaData.members.toLocaleString()} members
              </CoverSubtitle>

              <CoverDescription>{community.description}</CoverDescription>
            </Container>
          </HoverWrapper>
        );
      } else {
        return (
          <HoverWrapper
            top={this.props.top ? true : this.props.bottom ? false : true}
            bottom={this.props.bottom}
            right={this.props.right ? true : this.props.left ? false : true}
            left={this.props.left}
          >
            <Card style={{ boxShadow: '0 4px 8px rgba(18, 22, 23, .25)' }}>
              <CoverPhoto url={user.coverPhoto}>
                {currentUser &&
                  user &&
                  currentUser.id !== user.id && (
                    <Link
                      to={`/messages/new`}
                      onClick={() => this.initMessage(dispatch, user)}
                    >
                      <CoverAction
                        glyph="message-fill"
                        color="text.reverse"
                        hoverColor="text.reverse"
                        tipText={`Message ${user.name}`}
                        tipLocation={'left'}
                      />
                    </Link>
                  )}
              </CoverPhoto>
              <CoverLink to={`/users/${user.username}`}>
                <StyledAvatar
                  data={optimize(source, {
                    w: '64',
                    dpr: '2',
                    format: 'png',
                  })}
                  type="image/png"
                  size={64}
                  {...this.props}
                  style={{
                    boxShadow: '0 0 0 2px #fff',
                    flex: '0 0 64px',
                    width: '64px',
                    height: '64px',
                    marginRight: '0',
                  }}
                >
                  <StyledAvatarFallback
                    {...this.props}
                    src={
                      this.props.community
                        ? `/img/default_community.svg`
                        : `/img/default_avatar.svg`
                    }
                  />
                </StyledAvatar>
                <CoverTitle>{user.name}</CoverTitle>
              </CoverLink>
              <CoverSubtitle center>
                @{user.username}
                {user.isPro && <Badge type="pro" />}
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

              {user.totalReputation > 0 && (
                <ReputationContainer>
                  <Reputation
                    tipText={'Total rep across all communities'}
                    size={'large'}
                    reputation={
                      user.contextPermissions
                        ? user.contextPermissions.reputation
                        : user.totalReputation
                    }
                  />
                </ReputationContainer>
              )}
            </Card>
          </HoverWrapper>
        );
      }
    } else {
      return null;
    }
  }
}

const AvatarWithFallback = ({ style, ...props }) => (
  <StyledAvatarStatus size={props.size || 32} {...props}>
    <StyledAvatar
      data={optimize(props.source, { w: props.size, dpr: '2', format: 'png' })}
      type="image/png"
      size={props.size || 32}
      style={style}
      {...props}
    >
      <StyledAvatarFallback
        {...props}
        src={
          props.community
            ? `/img/default_community.svg`
            : `/img/default_avatar.svg`
        }
      />
    </StyledAvatar>
    <HoverProfile {...props} />
  </StyledAvatarStatus>
);

const Avatar = (props: Object): React$Element<any> => {
  const { src, community, user, size, link, noLink } = props;
  const source = src || community.profilePhoto || user.profilePhoto;
  if (link && !noLink) {
    return (
      <StyledAvatarLink to={link}>
        <AvatarWithFallback source={source} {...props} />
      </StyledAvatarLink>
    );
  } else {
    return <AvatarWithFallback source={source} {...props} />;
  }
};

const map = state => ({ currentUser: state.users.currentUser });

//$FlowFixMe
export default compose(connect(map), withRouter)(Avatar);
