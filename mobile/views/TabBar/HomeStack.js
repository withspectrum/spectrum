// @flow
import * as React from 'react';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Splash from '../Splash';
import BaseStack from './BaseStack';
import { store } from '../../App';
import { logout } from '../../actions/authentication';

const HomeStack = StackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        headerTitle: 'Home',
        headerRight: (
          <Button onPress={() => store.dispatch(logout())} title="Log out" />
        ),
      },
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'Splash',
  }
);

export default HomeStack;
