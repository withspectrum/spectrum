// @flow
import * as React from 'react';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Dashboard from '../Dashboard';
import BaseStack from './BaseStack';
import { store } from '../../App';
import { logout } from '../../actions/authentication';

const HomeStack = StackNavigator(
  {
    Dashboard: {
      screen: Dashboard,
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
    initialRouteName: 'Dashboard',
  }
);

export default HomeStack;
