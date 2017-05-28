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
import { MetaData } from './metaData';
import type { ProfileSizeProps } from './index';
import { Avatar } from '../avatar';
import Badge from '../badges';
import { displayLoadingCard } from '../loading';
import {
  ProfileHeader,
  ProfileHeaderLink,
  ProfileHeaderMeta,
  ProfileHeaderAction,
  Title,
  Subtitle,
  Description,
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

  // TODO: sort out this flow error */
  return (
    <Card>
      <ProfileHeader>
        <ProfileHeaderLink to={`../users/${currentUser.username}`}>
          <Avatar
            margin={'0 12px 0 0'}
            size={40}
            radius={4}
            src={user.profilePhoto}
          />
          <ProfileHeaderMeta>
            <Title>{user.name}</Title>
            <Subtitle>
              @{user.username}
              {user.isAdmin && <Badge type="admin" />}
              {/* user.isPro && <Badge type='pro' /> */}
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
              glyph="message-new"
              color="brand.alt"
              onClick={() => initMessage()}
              tipText={`Message ${user.name}`}
              tipLocation={'top-left'}
            />}
      </ProfileHeader>

      {componentSize !== 'mini' &&
        componentSize !== 'small' &&
        (user.description && user.description !== null) &&
        <Description>
          <p>{user.description}</p>
          {user.website &&
            <ExtLink>
              <Icon glyph="link" size={24} />
              <a href={addProtocolToString(user.website)}>
                {user.website}
              </a>
            </ExtLink>}
        </Description>}

      {(componentSize === 'large' || componentSize === 'full') &&
        <MetaData data={{ threads: user.threadCount }} />}
    </Card>
  );
};

const User = compose(displayLoadingCard, withRouter, pure)(UserWithData);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});
export default connect(mapStateToProps)(User);
