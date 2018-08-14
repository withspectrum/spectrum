// @flow
import * as React from 'react';
import { View } from 'react-native';
import { type GetCommunityType } from '../../../../../shared/graphql/queries/community/getCommunity';
import {
  CommunityCardWrapper,
  CommunityProfilePhoto,
  CommunityProfileName,
  CommunityProfileMemberCount,
  CommunityProfileDescription,
  CommunityProfileButtonContainer,
  CommunityProfileHeader,
} from './style';
import LoadingCard from './LoadingCard';
import { Button } from '../../../../components/Button';

type Props = {
  community: GetCommunityType,
  joinedCommunities: Array<?string>,
  onJoinCommunity: Function,
  onLeaveCommunity: Function,
};

class CommunityCard extends React.Component<Props> {
  join = () => {
    const { community } = this.props;
    return this.props.onJoinCommunity(community.id);
  };

  leave = () => {
    const { community } = this.props;
    return this.props.onLeaveCommunity(community.id);
  };

  render() {
    const { community, joinedCommunities } = this.props;
    const hasJoined = joinedCommunities.indexOf(community.id) >= 0;
    return (
      <CommunityCardWrapper>
        <View>
          <CommunityProfileHeader>
            <CommunityProfilePhoto source={{ uri: community.profilePhoto }} />
            <CommunityProfileButtonContainer>
              {hasJoined ? (
                <Button
                  onPress={this.leave}
                  icon={'checkmark'}
                  color={props => props.theme.text.default}
                />
              ) : (
                <Button
                  onPress={this.join}
                  title={'Join'}
                  color={props => props.theme.success.alt}
                />
              )}
            </CommunityProfileButtonContainer>
          </CommunityProfileHeader>

          <CommunityProfileName>{community.name}</CommunityProfileName>
          <CommunityProfileMemberCount>
            {community.metaData.members === 1
              ? `1 MEMBER`
              : `${community.metaData.members.toLocaleString()} MEMBERS`}
          </CommunityProfileMemberCount>
          {community.description && (
            <CommunityProfileDescription>
              {community.description}
            </CommunityProfileDescription>
          )}
        </View>
      </CommunityCardWrapper>
    );
  }
}

export { LoadingCard };
export default CommunityCard;
