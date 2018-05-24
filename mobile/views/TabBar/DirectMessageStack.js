// @flow
import * as React from 'react';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import idx from 'idx';
import BaseStack from './BaseStack';
import DirectMessages from '../DirectMessages';
import DirectMessageThread from '../DirectMessageThread';

const DMStack = StackNavigator(
  {
    DirectMessages: {
      screen: DirectMessages,
      navigationOptions: ({ navigation }) => ({
        headerTitle:
          idx(navigation, _ => _.state.params.title) || 'Direct Messages',
      }),
    },
    DirectMessageThread: {
      screen: DirectMessageThread,
      navigationOptions: ({ navigation }) => ({
        headerTitle:
          idx(navigation, _ => _.state.params.title) || 'Direct Message Thread',
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'DirectMessages',
  }
);

export default DMStack;
