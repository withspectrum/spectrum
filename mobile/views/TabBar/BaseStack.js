// @flow
// The basic view stack that's used on all of our screens
// Any view that's added here can be visited from any of our tabs
import Thread from '../Thread';
import Community from '../Community';
import Channel from '../Channel';
import User from '../User';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import type { NavigationScreenConfigProps } from 'react-navigation';

const BaseStack = {
  Thread: {
    screen: withMappedNavigationProps(Thread),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: navigation.state.params.title || 'Thread',
      tabBarVisible: false,
    }),
  },
  Community: {
    screen: withMappedNavigationProps(Community),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: null,
    }),
  },
  Channel: {
    screen: withMappedNavigationProps(Channel),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      headerTitle: null,
    }),
  },
  User: {
    screen: withMappedNavigationProps(User),
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      header: null,
    }),
  },
};

export default BaseStack;
