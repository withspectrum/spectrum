// @flow
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Splash from '../Splash';
import BaseStack from './BaseStack';

const HomeStack = StackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        headerTitle: 'Home',
      },
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'Splash',
  }
);

export default HomeStack;
