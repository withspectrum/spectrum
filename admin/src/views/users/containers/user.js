// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getUserByUsername } from '../../../api/queries';
import { displayLoadingState } from '../../../components/loading';
import ProfileHeader from '../../../components/profileHeader';
import UserCommunitySettings from '../components/userCommunitySettings';
import { View, UserCommunitySettingsContainer, SectionHeader } from '../style';

class UserContainer extends Component {
  render() {
    const { data: { error, user } } = this.props;
    if (error || !user) {
      return <div />;
    }
    const communities = user.communityConnection.edges.map(edge => edge.node);

    return (
      <View inner>
        <ProfileHeader user={user} />
        <UserCommunitySettingsContainer>
          <SectionHeader>Communities</SectionHeader>
          {communities.map(community => {
            return (
              <UserCommunitySettings
                community={community}
                key={Math.random()}
              />
            );
          })}
        </UserCommunitySettingsContainer>
      </View>
    );
  }
}

export default compose(getUserByUsername, displayLoadingState, pure)(
  UserContainer
);
