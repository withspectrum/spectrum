// @flow
import * as React from 'react';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import BaseStack from './BaseStack';
import DirectMessages from '../DirectMessages';

const DMStack = StackNavigator(
  {
    DirectMessages: {
      screen: DirectMessages,
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'DirectMessages',
  }
);

export default DMStack;
