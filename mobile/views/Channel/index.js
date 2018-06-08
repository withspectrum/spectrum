// @flow
import React, { Component } from 'react';
import { Text, View, StatusBar } from 'react-native';
import compose from 'recompose/compose';
import {
  getChannelById,
  type GetChannelType,
} from '../../../shared/graphql/queries/channel/getChannel';
import getChannelThreadConnection from '../../../shared/graphql/queries/channel/getChannelThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import ThreadFeed from '../../components/ThreadFeed';
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
  ThreadFeedDivider,
} from './style';
import ErrorBoundary from '../../components/ErrorBoundary';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    channel?: GetChannelType,
  },
};

const ChannelThreadFeed = compose(getChannelThreadConnection)(ThreadFeed);

class Channel extends Component<Props> {
  render() {
    const { data, isLoading, hasError, navigation } = this.props;
    if (data.channel) {
      const { channel } = data;

      return (
        <Wrapper>
          <StatusBar barStyle="light-content" />

          <ChannelThreadFeed
            navigation={navigation}
            id={channel.id}
            activeChannel={channel.id}
            activeCommunity={channel.community.id}
            ListHeaderComponent={
              <ErrorBoundary fallbackComponent={null}>
                <CoverPhotoContainer>
                  {channel.community.coverPhoto ? (
                    <CoverPhoto
                      resizeMode={'cover'}
                      source={{ uri: channel.community.coverPhoto }}
                    />
                  ) : (
                    <CoverPhotoFill />
                  )}
                </CoverPhotoContainer>

                <ProfilePhotoContainer>
                  <ProfilePhoto
                    source={{ uri: channel.community.profilePhoto }}
                  />
                </ProfilePhotoContainer>

                <ProfileDetailsContainer>
                  <Username>{channel.community.name}</Username>
                  <Name>{channel.name}</Name>
                  <Description>{channel.description}</Description>
                </ProfileDetailsContainer>

                <ThreadFeedDivider />
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
      return (
        <Wrapper>
          <View testID="e2e-channel">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(getChannelById, ViewNetworkHandler)(Channel);
