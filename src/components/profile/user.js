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
import Icon from '../icons';
import { CoverPhoto } from './coverPhoto';
import type { ProfileSizeProps } from './index';
import { Avatar } from '../avatar';
import Badge from '../badges';
import { displayLoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  CoverLink,
  UserAvatar,
  CoverAvatar,
  CoverTitle,
  CoverSubtitle,
  CoverDescription,
  Title,
  Subtitle,
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
    return <div />;
  }

  const initMessage = () => {
    dispatch(initNewThreadWithUser(user));
    history.push('/messages/new');
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
            <CoverAvatar src={`${user.profilePhoto}?w=40&dpr=2`} />
            <CoverTitle>{user.name}</CoverTitle>
          </CoverLink>
        </CoverPhoto>
        <CoverSubtitle>
          @{user.username}
          {user.isAdmin && <Badge type="admin" />}
          {user.isPro && <Badge type="pro" />}
        </CoverSubtitle>

        {(user.description || user.website) &&
          <CoverDescription>
            {user.description && <p>{user.description}</p>}
            {user.website &&
              <ExtLink>
                <Icon glyph="link" size={24} />
                <a href={addProtocolToString(user.website)}>
                  {user.website}
                </a>
              </ExtLink>}
          </CoverDescription>}
      </Card>
    );
  } else {
    return (
      <Card>
        <ProfileHeader>
          <ProfileHeaderLink to={`../users/${user.username}`}>
            <UserAvatar src={`${user.profilePhoto}?w=40&dpr=2`} />
            <ProfileHeaderMeta>
              <Title>{user.name}</Title>
              <Subtitle>
                @{user.username}
                {user.isAdmin && <Badge type="admin" />}
                {user.isPro && <Badge type="pro" />}
              </Subtitle>
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
                color="brand.alt"
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
