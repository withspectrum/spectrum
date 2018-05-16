// @flow
import * as React from 'react';
import { Text, View, StatusBar, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import getUserThreadConnection from '../../../shared/graphql/queries/user/getUserThreadConnection';
import ThreadFeed from '../../components/ThreadFeed';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';

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

class User extends React.Component<Props, State> {
  state = { feed: 'participant' };

  componentDidUpdate() {
    const { data: { user }, navigation } = this.props;
    if (!user || navigation.state.params.title) return;
    navigation.setParams({ title: `${user.name} (@${user.username})` });
  }

  toggleFeed = (feed: string) => this.setState({ feed });

  render() {
    const { data, isLoading, hasError, navigation } = this.props;
    const { feed } = this.state;

    console.log('this props', this.props);

    if (data.user) {
      return (
        <Wrapper>
          <StatusBar barStyle="light-content" />

          <ScrollView>
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
                <TabLabel isActive={feed === 'participant'}>Replies</TabLabel>
              </ThreadFeedTab>
              <ThreadFeedTab
                onPress={() => this.toggleFeed('creator')}
                isActive={feed === 'creator'}
              >
                <TabLabel isActive={feed === 'creator'}>Threads</TabLabel>
              </ThreadFeedTab>
            </ThreadFeedTabContainer>

            <UserThreadFeed
              navigation={navigation}
              kind={this.state.feed}
              id={data.user.id}
            />
          </ScrollView>
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-User">
            <Text>Loading...</Text>
          </View>
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
