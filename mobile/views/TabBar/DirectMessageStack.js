// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import BaseStack from './BaseStack';
import DirectMessages from '../DirectMessages';
import DirectMessageThread from '../DirectMessageThread';
import DirectMessageThreadDetail from '../DirectMessageThreadDetail';
import Info from './headerActions/Info';
import Compose from './headerActions/Compose';
import type { NavigationScreenConfigProps } from 'react-navigation';

const DMStack = createStackNavigator(
  {
    DirectMessages: {
      screen: withMappedNavigationProps(DirectMessages),
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('title', 'Messages'),
        headerRight: (
          <Compose
            onPress={() =>
              navigation.navigate({
                routeName: 'DirectMessageComposer',
              })
            }
          />
        ),
      }),
    },
    DirectMessageThread: {
      screen: withMappedNavigationProps(DirectMessageThread),
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('title', null),
        headerRight: (
          <Info
            onPress={() =>
              navigation.navigate({
                routeName: `DirectMessageThreadDetail`,
                key: `direct-message-thread-detail-${navigation.state.key}`,
                params: { id: navigation.state.params.id },
              })
            }
          />
        ),
      }),
    },
    DirectMessageThreadDetail: {
      screen: withMappedNavigationProps(DirectMessageThreadDetail),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: 'Details',
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'DirectMessages',
  }
);

export default DMStack;
