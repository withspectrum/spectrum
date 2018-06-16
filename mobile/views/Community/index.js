// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import {
  getCommunityById,
  type GetCommunityType,
} from '../../../shared/graphql/queries/community/getCommunity';
import getCommunityThreads from '../../../shared/graphql/queries/community/getCommunityThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import ThreadFeed from '../../components/ThreadFeed';
import { ThreadListItem } from '../../components/Lists';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import Loading from '../../components/Loading';
import { track, events, transformations } from '../../utils/analytics';
import JoinButton from './JoinButton';

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
            routeName: 'Thread',
            key: data.thread.id,
            params: { id: data.thread.id },
          })
        }
      />
    );
  }
);

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

class Community extends Component<Props> {
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

  render() {
    const { data: { community }, isLoading, hasError, navigation } = this.props;

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

                  <JoinButton community={community} />
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

export default compose(getCommunityById, ViewNetworkHandler)(Community);
