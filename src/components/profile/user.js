// @flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import Card from '../card';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { addProtocolToString } from '../../helpers/utils';
import { initNewThreadWithUser } from '../../actions/directMessageThreads';
import { openModal } from '../../actions/modals';
import Icon from '../icons';
import { CoverPhoto } from './coverPhoto';
import { Button } from '../buttons';
import type { ProfileSizeProps } from './index';
import Badge from '../badges';
import { displayLoadingCard } from '../loading';
import {
  ProfileAvatar,
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  CoverLink,
  CoverAvatar,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  Title,
  Subtitle,
  ExtLink,
  ProUpgrade,
} from './style';

type UserProps = {
  id: string,
  profilePhoto: string,
  displayName: string,
  name: ?string,
  username: string,
  threadCount: number,
  website: string,
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

  const triggerUpgrade = () => {
    dispatch(openModal('UPGRADE_MODAL', { user: currentUser }));
  };

  if (componentSize === 'full') {
    return (
      <Card>
        <CoverPhoto
          user={user}
          onClick={() => initMessage()}
          currentUser={currentUser}
        >
          <CoverLink to={`/users/${user.username}`}>
            <CoverAvatar
              size={64}
              radius={64}
              onlineSize={'large'}
              isOnline={user.isOnline}
              src={`${user.profilePhoto}`}
              noLink
            />
            <CoverTitle>
              {user.name}
            </CoverTitle>
          </CoverLink>
        </CoverPhoto>
        <CoverSubtitle center>
          @{user.username}
          {user.isAdmin && <Badge type="admin" />}
          {user.isPro && <Badge type="pro" />}
        </CoverSubtitle>

        {(user.description || user.website) &&
          <CoverDescription>
            {user.description &&
              <p>
                {user.description}
              </p>}
            {user.website &&
              <ExtLink>
                <Icon glyph="link" size={24} />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={addProtocolToString(user.website)}
                >
                  {user.website}
                </a>
              </ExtLink>}
          </CoverDescription>}

        {!user.isPro &&
          currentUser &&
          user.id === currentUser.id &&
          <ProUpgrade>
            <Button onClick={() => triggerUpgrade()} gradientTheme={'success'}>
              Upgrade to Pro
            </Button>
          </ProUpgrade>}
      </Card>
    );
  } else if (componentSize === 'simple') {
    return (
      <Card>
        <CoverPhoto
          user={user}
          onClick={() => initMessage()}
          currentUser={currentUser}
        >
          <CoverLink to={`/users/${user.username}`}>
            <CoverAvatar
              size={64}
              radius={64}
              onlineSize={'large'}
              isOnline={user.isOnline}
              src={`${user.profilePhoto}`}
              noLink
            />
            <CoverTitle>
              {user.name}
            </CoverTitle>
          </CoverLink>
        </CoverPhoto>
        <CoverSubtitle center>
          {user.username && `@${user.username}`}
          {user.isAdmin && <Badge type="admin" />}
          {user.isPro && <Badge type="pro" />}
        </CoverSubtitle>

        {user.description &&
          <CoverDescription>
            <p>
              {user.description}
            </p>
          </CoverDescription>}
      </Card>
    );
  } else {
    return (
      <Card>
        <ProfileHeader>
          <ProfileHeaderLink
            to={user.username ? `/users/${user.username}` : null}
          >
            <ProfileAvatar
              size={32}
              radius={32}
              isOnline={user.isOnline}
              src={`${user.profilePhoto}`}
              noLink
            />
            <ProfileHeaderMeta>
              <Title>
                {user.name}
              </Title>
              {user.username &&
                <Subtitle>
                  @{user.username}
                  {user.isAdmin && <Badge type="admin" />}
                  {user.isPro && <Badge type="pro" />}
                </Subtitle>}
            </ProfileHeaderMeta>
          </ProfileHeaderLink>
          {currentUser && currentUser.id === user.id
            ? <Link to={`../users/${currentUser.username}/settings`}>
                <ProfileHeaderAction
                  glyph="settings"
                  tipText={`Edit profile`}
                  tipLocation={'top-left'}
                />
              </Link>
            : <ProfileHeaderAction
                glyph="message-fill"
                color="text.alt"
                hoverColor="brand.alt"
                onClick={() => initMessage()}
                tipText={`Message ${user.name}`}
                tipLocation={'top-left'}
              />}
        </ProfileHeader>
      </Card>
    );
  }
};

const User = compose(displayLoadingCard, withRouter, pure)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});
export default connect(mapStateToProps)(User);
