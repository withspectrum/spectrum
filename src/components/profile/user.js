// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import Card from 'src/components/card';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import addProtocolToString from 'shared/normalize-url';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { initNewThreadWithUser } from 'src/actions/directMessageThreads';
import Icon from '../icons';
import { CoverPhoto } from './coverPhoto';
import GithubProfile from 'src/components/githubProfile';
import type { ProfileSizeProps } from './index';
import { UserAvatar } from 'src/components/avatar';
import Badge from 'src/components/badges';
import { displayLoadingCard } from 'src/components/loading';
import Reputation from 'src/components/reputation';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  FullProfile,
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderNoLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  CoverLink,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  FullTitle,
  Subtitle,
  FullDescription,
  Title,
  ExtLink,
  OnlineIndicator,
} from './style';

type CurrentUserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  username: string,
  name: ?string,
  website: string,
};

type ThisUserType = {
  ...$Exact<GetUserType>,
  contextPermissions: {
    reputation: number,
  },
};

type UserWithDataProps = {
  data: { user: ThisUserType },
  profileSize: ProfileSizeProps,
  currentUser: CurrentUserProps,
  dispatch: Dispatch<Object>,
  history: Object,
  showHoverProfile: boolean,
};

const UserWithData = ({
  data: { user },
  profileSize,
  currentUser,
  dispatch,
  history,
  showHoverProfile = true,
}: UserWithDataProps): ?React$Element<any> => {
  const componentSize = profileSize || 'mini';

  if (!user) {
    return null;
  }

  const initMessage = () => {
    dispatch(initNewThreadWithUser(user));
    history.push('/messages/new');
  };

  switch (componentSize) {
    case 'full':
      return (
        <FullProfile>
          <UserAvatar
            user={user}
            size={128}
            showHoverProfile={showHoverProfile}
            showOnlineStatus={false}
            style={{
              boxShadow: '0 0 0 2px #fff',
              marginRight: '0',
            }}
          />
          <FullTitle>{user.name}</FullTitle>
          <Subtitle>
            <span style={{ marginRight: '4px' }}>@{user.username}</span>
            {user.betaSupporter && <Badge type="beta-supporter" />}
          </Subtitle>

          <FullDescription>
            {user.description && <p>{renderTextWithLinks(user.description)}</p>}

            {user.isOnline && (
              <ExtLink>
                <OnlineIndicator /> Online now
              </ExtLink>
            )}

            <Reputation
              reputation={
                user.contextPermissions
                  ? user.contextPermissions.reputation
                  : user.totalReputation
              }
            />
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
            <GithubProfile
              id={user.id}
              render={profile => {
                if (!profile) {
                  return null;
                } else {
                  return (
                    <ExtLink>
                      <Icon glyph="github" size={24} />
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://github.com/${profile.username}`}
                      >
                        github.com/
                        {profile.username}
                      </a>
                    </ExtLink>
                  );
                }
              }}
            />
          </FullDescription>
        </FullProfile>
      );
    case 'simple':
      return (
        <Card>
          <CoverPhoto
            user={user}
            onClick={() => initMessage()}
            currentUser={currentUser}
          />
          <CoverLink to={`/users/${user.username}`}>
            <UserAvatar
              user={user}
              size={64}
              showHoverProfile={showHoverProfile}
              style={{
                boxShadow: '0 0 0 2px #fff',
                flex: '0 0 64px',
                marginRight: '0',
              }}
            />
            <CoverTitle>{user.name}</CoverTitle>
          </CoverLink>
          <CoverSubtitle center>
            {user.username && `@${user.username}`}
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

          {user.description && (
            <CoverDescription>
              <p>{user.description}</p>
            </CoverDescription>
          )}
        </Card>
      );
    case 'default':
    default:
      return (
        <Card>
          <ProfileHeader>
            {user.username ? (
              <ProfileHeaderLink to={`/users/${user.username}`}>
                <UserAvatar
                  user={user}
                  size={32}
                  showHoverProfile={showHoverProfile}
                  style={{ marginRight: '16px' }}
                />
                <ProfileHeaderMeta>
                  <Title>{user.name}</Title>
                  {user.username && <Subtitle>@{user.username}</Subtitle>}
                </ProfileHeaderMeta>
              </ProfileHeaderLink>
            ) : (
              <ProfileHeaderNoLink>
                <UserAvatar
                  user={user}
                  size={32}
                  showHoverProfile={showHoverProfile}
                  style={{ marginRight: '16px' }}
                />
                <ProfileHeaderMeta>
                  <Title>{user.name}</Title>
                  {user.username && (
                    <Subtitle>
                      @{user.username}
                      <Reputation
                        tipText={'Total rep across all communities'}
                        size={'large'}
                        reputation={
                          user.contextPermissions
                            ? user.contextPermissions.reputation
                            : user.totalReputation
                        }
                      />
                    </Subtitle>
                  )}
                </ProfileHeaderMeta>
              </ProfileHeaderNoLink>
            )}
            {currentUser && currentUser.id === user.id ? (
              <Link to={`../users/${currentUser.username}/settings`}>
                <ProfileHeaderAction
                  glyph="settings"
                  tipText={'Edit profile'}
                  tipLocation={'top-left'}
                />
              </Link>
            ) : (
              <ProfileHeaderAction
                glyph="message-fill"
                color="text.alt"
                hoverColor="brand.alt"
                onClick={() => initMessage()}
                tipText={`Message ${user.name}`}
                tipLocation={'top-left'}
              />
            )}
          </ProfileHeader>
        </Card>
      );
  }
};

const User = compose(
  displayLoadingCard,
  withRouter,
  withCurrentUser
)(UserWithData);
const mapStateToProps = state => ({
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});
// $FlowFixMe
export default connect(mapStateToProps)(User);
