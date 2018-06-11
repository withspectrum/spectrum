// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import getUserThreadConnection from '../../../shared/graphql/queries/user/getUserThreadConnection';
import ThreadFeed from '../../components/ThreadFeed';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import Loading from '../../components/Loading';
import ErrorBoundary from '../../components/ErrorBoundary';
import { FullscreenNullState } from '../../components/NullStates';

import {
  Wrapper,
  CoverPhoto,
  CoverPhotoFill,
  CoverPhotoContainer,
  ProfilePhoto,
  ProfilePhotoContainer,
  ProfileDetailsContainer,
  Name,
  Username,
  Description,
  ThreadFeedTabContainer,
  ThreadFeedTab,
  TabLabel,
} from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    user?: GetUserType,
  },
};

type State = {
  feed: string,
};

const UserThreadFeed = compose(getUserThreadConnection)(ThreadFeed);

class User extends Component<Props, State> {
  state = { feed: 'participant' };

  setTitle = () => {
    const { data: { user }, navigation } = this.props;
    let title;
    if (user) {
      title = `${user.name} (@${user.username})`;
    } else {
      title = 'Loading user...';
    }
    if (navigation.state.params.title === title) return;
    navigation.setParams({ title });
  };

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate() {
    this.setTitle();
  }

  toggleFeed = (feed: string) => this.setState({ feed });

  render() {
    const { data, isLoading, hasError, navigation } = this.props;
    const { feed } = this.state;

    if (data.user) {
      return (
        <Wrapper>
          <UserThreadFeed
            navigation={navigation}
            kind={this.state.feed}
            id={data.user.id}
            ListHeaderComponent={
              <ErrorBoundary fallbackComponent={null}>
                <CoverPhotoContainer>
                  {data.user.coverPhoto ? (
                    <CoverPhoto
                      resizeMode={'cover'}
                      source={{ uri: data.user.coverPhoto }}
                    />
                  ) : (
                    <CoverPhotoFill />
                  )}
                </CoverPhotoContainer>

                <ProfilePhotoContainer>
                  <ProfilePhoto source={{ uri: data.user.profilePhoto }} />
                </ProfilePhotoContainer>

                <ProfileDetailsContainer>
                  <Name>{data.user.name}</Name>
                  <Username>@{data.user.username}</Username>
                  <Description>{data.user.description}</Description>
                </ProfileDetailsContainer>

                <ThreadFeedTabContainer>
                  <ThreadFeedTab
                    onPress={() => this.toggleFeed('participant')}
                    isActive={feed === 'participant'}
                  >
                    <TabLabel isActive={feed === 'participant'}>
                      Replies
                    </TabLabel>
                  </ThreadFeedTab>
                  <ThreadFeedTab
                    onPress={() => this.toggleFeed('creator')}
                    isActive={feed === 'creator'}
                  >
                    <TabLabel isActive={feed === 'creator'}>Threads</TabLabel>
                  </ThreadFeedTab>
                </ThreadFeedTabContainer>
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

export default User;
