// @flow
// The basic view stack that's used on all of our screens
// Any view that's added here can be visited from any of our tabs
import React from 'react';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import Thread from '../Thread';
import ThreadDetail from '../ThreadDetail';
import Community from '../Community';
import CommunityDetail from '../CommunityDetail';
import Channel from '../Channel';
import ChannelDetail from '../ChannelDetail';
import UserDetail from '../UserDetail';
import User from '../User';
import Info from './headerActions/Info';
import type { NavigationScreenConfigProps } from 'react-navigation';

const BaseStack = {
  ThreadDetail: {
    screen: withMappedNavigationProps(ThreadDetail),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: 'Details',
    }),
  },
  Thread: {
    screen: withMappedNavigationProps(Thread),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.getParam('title', null),
      headerRight: (
        <Info
          onPress={() =>
            navigation.navigate({
              routeName: `ThreadDetail`,
              key: `thread-detail-${navigation.state.key}`,
              params: { id: navigation.state.params.id },
            })
          }
        />
      ),
    }),
  },
  CommunityDetail: {
    screen: withMappedNavigationProps(CommunityDetail),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: 'Details',
    }),
  },
  Community: {
    screen: withMappedNavigationProps(Community),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.getParam('title', null),
      headerRight: (
        <Info
          onPress={() =>
            navigation.navigate({
              routeName: `CommunityDetail`,
              key: `community-detail-${navigation.state.key}`,
              params: { id: navigation.state.params.id },
            })
          }
        />
      ),
    }),
  },
  ChannelDetail: {
    screen: withMappedNavigationProps(ChannelDetail),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: 'Details',
    }),
  },
  Channel: {
    screen: withMappedNavigationProps(Channel),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.getParam('title', null),
      headerRight: (
        <Info
          onPress={() =>
            navigation.navigate({
              routeName: `ChannelDetail`,
              key: `channel-detail-${navigation.state.key}`,
              params: { id: navigation.state.params.id },
            })
          }
        />
      ),
    }),
  },
  User: {
    screen: withMappedNavigationProps(User),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.getParam('title', null),
      headerRight: (
        <Info
          onPress={() =>
            navigation.navigate({
              routeName: `UserDetail`,
              key: `user-detail-${navigation.state.key}`,
              params: { id: navigation.state.params.id },
            })
          }
        />
      ),
    }),
  },
  UserDetail: {
    screen: withMappedNavigationProps(UserDetail),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: 'Details',
    }),
  },
};

export default BaseStack;
