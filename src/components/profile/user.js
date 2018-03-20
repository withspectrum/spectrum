import React from 'react';
import Link from 'src/components/link';
import Card from '../card';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import addProtocolToString from 'shared/normalize-url';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
import Icon from '../icons';
import { CoverPhoto } from './coverPhoto';
import GithubProfile from '../../components/githubProfile';
import type { ProfileSizeProps } from './index';
import Avatar from '../avatar';
import Badge from '../badges';
import { displayLoadingCard } from '../loading';
import Reputation from '../reputation';
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
} from './style';

type UserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  name: ?string,
  username: string,
  threadCount: number,
  website: string,
  isOnline: string,
  totalReputation: number,
};

type CurrentUserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  username: string,
  name: ?string,
  website: string,
};

const UserWithData = ({
  data: { user },
  profileSize,
  currentUser,
  dispatch,
  history,
}: {
  data: { user: UserProps },
  profileSize: ProfileSizeProps,
  currentUser: CurrentUserProps,
  dispatch: Function,
  history: Object,
}): React$Element<any> => {
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
          <Avatar
            user={user}
            size={128}
            onlineSize={'large'}
            src={`${user.profilePhoto}`}
            noLink
            style={{
              boxShadow: '0 0 0 2px #fff',
              marginRight: '0',
            }}
          />
          <FullTitle>{user.name}</FullTitle>
          <Subtitle>
            @{user.username}
            {user.isPro && <Badge type="pro" />}
          </Subtitle>
          {(user.description || user.website) && (
            <FullDescription>
              {user.description && <p>{user.description}</p>}
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
                          github.com/{profile.username}
                        </a>
                      </ExtLink>
                    );
                  }
                }}
              />
            </FullDescription>
          )}
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
            <Avatar
              user={user}
              size={64}
              radius={64}
              onlineSize={'large'}
              isOnline={user.isOnline}
              src={`${user.profilePhoto}`}
              noLink
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
                <Avatar
                  user={user}
                  size={32}
                  radius={32}
                  isOnline={user.isOnline}
                  src={`${user.profilePhoto}`}
                  noLink
                  style={{ marginRight: '16px' }}
                />
                <ProfileHeaderMeta>
                  <Title>{user.name}</Title>
                  {user.username && (
                    <Subtitle>
                      @{user.username}
                      {user.isPro && <Badge type="pro" />}
                    </Subtitle>
                  )}
                </ProfileHeaderMeta>
              </ProfileHeaderLink>
            ) : (
              <ProfileHeaderNoLink>
                <Avatar
                  user={user}
                  size={32}
                  radius={32}
                  isOnline={user.isOnline}
                  src={`${user.profilePhoto}`}
                  noLink
                  style={{ marginRight: '16px' }}
                />
                <ProfileHeaderMeta>
                  <Title>{user.name}</Title>
                  {user.username && (
                    <Subtitle>
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

const User = compose(displayLoadingCard, withRouter)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});
export default connect(mapStateToProps)(User);
