// @flow
import React, { Component, Fragment } from 'react';
import { Text, View, StatusBar } from 'react-native';
import compose from 'recompose/compose';
import getUserThreadConnection from '../../../shared/graphql/queries/user/getUserThreadConnection';
import ThreadFeed from '../../components/ThreadFeed';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import Loading from '../../components/Loading';

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

  componentDidUpdate() {
    const { data: { user }, navigation } = this.props;
    if (!user) return;
    const title = navigation.getParam('title');
    if (!title && user) return navigation.setParams({ title: user.name });
    if (title && title !== user.name)
      return navigation.setParams({ title: user.name });
  }

  toggleFeed = (feed: string) => this.setState({ feed });

  render() {
    const { data, isLoading, hasError, navigation } = this.props;
    const { feed } = this.state;

    if (data.user) {
      return (
        <Wrapper>
          <StatusBar barStyle="light-content" />
          <UserThreadFeed
            navigation={navigation}
            kind={this.state.feed}
            id={data.user.id}
            ListHeaderComponent={
              <Fragment>
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
              </Fragment>
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
      return (
        <Wrapper>
          <View testID="e2e-User">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default User;
