// @flow
// The basic view stack that's used on all of our screens
// Any view that's added here can be visited from any of our tabs
import * as React from 'react';
import Thread from '../Thread';
import ThreadDetail from '../ThreadDetail';
import Community from '../Community';
import Channel from '../Channel';
import User from '../User';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import type { NavigationScreenConfigProps } from 'react-navigation';
import NavigateToThreadDetails from './headerActions/NavigateToThreadDetails';

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
      headerTitle: navigation.state.params.title || 'Thread',
      headerRight: <NavigateToThreadDetails navigation={navigation} />,
    }),
  },
  Community: {
    screen: withMappedNavigationProps(Community),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.state.params.title || null,
    }),
  },
  Channel: {
    screen: withMappedNavigationProps(Channel),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.state.params.title || null,
    }),
  },
  User: {
    screen: withMappedNavigationProps(User),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.state.params.title || null,
    }),
  },
};

export default BaseStack;
