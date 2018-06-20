// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { Button } from 'react-native';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import BaseStack from './BaseStack';
import DirectMessages from '../DirectMessages';
import DirectMessageThread from '../DirectMessageThread';
import DirectMessageComposer from '../DirectMessageComposer';
import DirectMessageThreadDetail from '../DirectMessageThreadDetail';
import type { NavigationScreenConfigProps } from 'react-navigation';
import NavigateToDirectMessageThreadDetails from './headerActions/NavigateToDirectMessageThreadDetails';

const DMStack = createStackNavigator(
  {
    DirectMessages: {
      screen: withMappedNavigationProps(DirectMessages),
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('title', 'Messages'),
        headerRight: (
          <Button
            onPress={() => navigation.navigate('DirectMessageComposer')}
            title="New"
          />
        ),
      }),
    },
    DirectMessageThread: {
      screen: withMappedNavigationProps(DirectMessageThread),
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('title', null),
        headerRight: (
          <NavigateToDirectMessageThreadDetails navigation={navigation} />
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

const ModalStack = createStackNavigator(
  {
    DirectMessages: {
      screen: withMappedNavigationProps(DMStack),
      // We don't want to show two headers, so we hide the header of the second stack
      navigationOptions: {
        header: null,
      },
    },
    DirectMessageComposer: {
      screen: withMappedNavigationProps(DirectMessageComposer),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: navigation.getParam('title', 'New Message'),
        headerLeft: ({ onPress }) => (
          <Button onPress={onPress} title="Cancel" />
        ),
      }),
    },
  },
  {
    mode: 'modal',
    initialRouteName: 'DirectMessages',
  }
);

export default ModalStack;
