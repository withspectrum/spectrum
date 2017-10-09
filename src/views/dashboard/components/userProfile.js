import * as React from 'react';
import { ReputationMiniCommunity } from '../../../components/reputation';
import Avatar from '../../../components/avatar';
import Icon from '../../../components/icons';
import { truncateNumber } from '../../../helpers/utils';
import {
  UserProfileContainer,
  UserProfileText,
  UserProfileName,
  UserProfileNameLink,
  UserProfileReputation,
  UserProfileSettingsLink,
} from '../style';

type Props = {
  user: {
    name: string,
    profilePhoto: string,
    username: string,
    totalReputation: number,
  },
};
class UserProfile extends React.Component<Props> {
  render() {
    const { user } = this.props;
    return (
      <UserProfileContainer>
        <Avatar
          src={user.profilePhoto}
          link={user.username ? `/users/${user.username}` : null}
          size={32}
        />

        <UserProfileText>
          {user.username ? (
            <UserProfileNameLink to={`/users/${user.username}`}>
              {user.name}
            </UserProfileNameLink>
          ) : (
            <UserProfileName>{user.name}</UserProfileName>
          )}
          <UserProfileReputation>
            <ReputationMiniCommunity
              tipLocation={'bottom-right'}
              tipText={'Your total reputation'}
            />
            {user.totalReputation > 0
              ? truncateNumber(user.totalReputation)
              : '0'}
          </UserProfileReputation>
        </UserProfileText>

        {user.username && (
          <UserProfileSettingsLink to={`/users/${user.username}/settings`}>
            <Icon glyph={'settings'} size={32} />
          </UserProfileSettingsLink>
        )}
      </UserProfileContainer>
    );
  }
}

export default UserProfile;
