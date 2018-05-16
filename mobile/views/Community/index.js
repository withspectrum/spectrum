// @flow
import * as React from 'react';
import { Text, View, StatusBar, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import {
  getCommunityById,
  type GetCommunityType,
} from '../../../shared/graphql/queries/community/getCommunity';
import getCommunityThreads from '../../../shared/graphql/queries/community/getCommunityThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import ThreadFeed from '../../components/ThreadFeed';
import ThreadItem from '../../components/ThreadItem';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';

import {
  Wrapper,
  CoverPhoto,
  CoverPhotoFill,
  CoverPhotoContainer,
  ProfilePhoto,
  ProfilePhotoContainer,
  ProfileDetailsContainer,
  Name,
  Description,
  ThreadFeedDivider,
} from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    community?: GetCommunityType,
  },
};

const RemoteThreadItem = compose(getThreadById, withNavigation)(
  ({ data, navigation }) => {
    if (data.loading) return <Text>Loading...</Text>;
    if (!data.thread) return null;
    return <ThreadItem thread={data.thread} navigation={navigation} />;
  }
);

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

class Community extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading, hasError, navigation } = this.props;

    if (community) {
      return (
        <Wrapper>
          <StatusBar barStyle="light-content" />

          <ScrollView>
            <CoverPhotoContainer>
              {community.coverPhoto ? (
                <CoverPhoto
                  resizeMode={'cover'}
                  source={{ uri: community.coverPhoto }}
                />
              ) : (
                <CoverPhotoFill />
              )}
            </CoverPhotoContainer>

            <ProfilePhotoContainer>
              <ProfilePhoto source={{ uri: community.profilePhoto }} />
            </ProfilePhotoContainer>

            <ProfileDetailsContainer>
              <Name>{community.name}</Name>
              <Description>{community.description}</Description>
            </ProfileDetailsContainer>

            <ThreadFeedDivider />

            {community.pinnedThreadId && (
              <RemoteThreadItem id={community.pinnedThreadId} />
            )}
            {community.watercoolerId && (
              <RemoteThreadItem id={community.watercoolerId} />
            )}

            <CommunityThreadFeed
              navigation={navigation}
              id={community.id}
              activeCommunity={community.id}
            />
          </ScrollView>
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-community">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-community">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(getCommunityById, ViewNetworkHandler)(Community);
