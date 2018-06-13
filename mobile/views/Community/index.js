// @flow
import React, { Component } from 'react';
import { Button } from 'react-native';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import {
  getCommunityById,
  type GetCommunityType,
} from '../../../shared/graphql/queries/community/getCommunity';
import addCommunityMember, {
  type AddCommunityMemberProps,
} from '../../../shared/graphql/mutations/communityMember/addCommunityMember';
import removeCommunityMember, {
  type RemoveCommunityMemberProps,
} from '../../../shared/graphql/mutations/communityMember/removeCommunityMember';
import getCommunityThreads from '../../../shared/graphql/queries/community/getCommunityThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import ThreadFeed from '../../components/ThreadFeed';
import { ThreadListItem } from '../../components/Lists';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import Loading from '../../components/Loading';
import { track, events, transformations } from '../../utils/analytics';

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
import ErrorBoundary from '../../components/ErrorBoundary';
import { FullscreenNullState } from '../../components/NullStates';

type Props = {
  ...$Exact<AddCommunityMemberProps>,
  ...$Exact<RemoveCommunityMemberProps>,
  isLoading: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    community?: GetCommunityType,
  },
};

const RemoteThreadItem = compose(getThreadById, withNavigation)(
  ({ data, navigation }) => {
    if (data.loading) return <Loading />;
    if (!data.thread) return null;
    return (
      <ThreadListItem
        refetch={data.refetch}
        activeCommunity={data.thread.community.id}
        thread={data.thread}
        onPressHandler={() =>
          navigation.navigate({
            routeName: `Thread`,
            key: data.thread.id,
            params: { id: data.thread.id },
          })
        }
      />
    );
  }
);

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

type State = {
  loadingMembershipToggle: boolean,
};

class Community extends Component<Props, State> {
  state = {
    loadingMembershipToggle: false,
  };

  trackView = () => {
    const { data: { community } } = this.props;
    if (!community) return;
    track(events.COMMUNITY_VIEWED, {
      community: transformations.analyticsCommunity(community),
    });
  };

  setTitle = () => {
    const { data: { community }, navigation } = this.props;
    let title;
    if (community) {
      title = community.name;
    } else {
      title = 'Loading community...';
    }
    const oldTitle = navigation.getParam('title', null);
    if (oldTitle && oldTitle === title) return;
    navigation.setParams({ title });
  };

  componentDidMount() {
    this.trackView();
    this.setTitle();
  }

  componentDidUpdate(prev) {
    const curr = this.props;
    const first = !prev.data.community && curr.data.community;
    const changed =
      prev.data.community &&
      curr.data.community &&
      prev.data.community.id !== curr.data.community.id;
    if (first || changed) {
      this.trackView();
    }

    this.setTitle();
  }

  toggleMembership = () => {
    const { data: { community } } = this.props;
    if (!community) return;

    this.setState({
      loadingMembershipToggle: true,
    });
    if (community.communityPermissions.isMember) {
      this.props
        .removeCommunityMember({ input: { communityId: community.id } })
        .then(() => {
          this.setState({
            loadingMembershipToggle: false,
          });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loadingMembershipToggle: false,
          });
        });
    } else {
      this.props
        .addCommunityMember({ input: { communityId: community.id } })
        .then(() => {
          this.setState({
            loadingMembershipToggle: false,
          });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            loadingMembershipToggle: false,
          });
        });
    }
  };

  render() {
    const { data: { community }, isLoading, hasError, navigation } = this.props;
    const { loadingMembershipToggle } = this.state;

    if (community) {
      return (
        <Wrapper>
          <CommunityThreadFeed
            navigation={navigation}
            id={community.id}
            activeCommunity={community.id}
            ListHeaderComponent={
              <ErrorBoundary alert>
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
                  <Button
                    onPress={this.toggleMembership}
                    disabled={loadingMembershipToggle}
                    title={
                      loadingMembershipToggle
                        ? 'Loading...'
                        : community.communityPermissions.isMember
                          ? 'Leave'
                          : 'Join'
                    }
                  />
                </ProfileDetailsContainer>

                <ThreadFeedDivider />

                {community.pinnedThreadId && (
                  <RemoteThreadItem
                    id={community.pinnedThreadId}
                    activeCommunity={community.id}
                  />
                )}
                {community.watercoolerId && (
                  <RemoteThreadItem
                    id={community.watercoolerId}
                    activeCommunity={community.id}
                  />
                )}
              </ErrorBoundary>
            }
          />
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <Loading />
        </Wrapper>
      );
    }

    if (hasError) {
      return <FullscreenNullState />;
    }

    return null;
  }
}

export default compose(
  addCommunityMember,
  removeCommunityMember,
  getCommunityById,
  ViewNetworkHandler
)(Community);
