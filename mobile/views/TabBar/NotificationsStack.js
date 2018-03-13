// @flow
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Notifications from '../Notifications';
import BaseStack from './BaseStack';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

const NotificationsStack = StackNavigator(
  {
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        headerTitle: 'Notifications',
      },
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'Notifications',
  }
);

export default NotificationsStack;
