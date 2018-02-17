// @flow
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Thread from '../Thread';
import Notifications from '../Notifications';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

const NotificationsNavigator = StackNavigator(
  {
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        headerTitle: 'Notifications',
      },
    },
    Thread: {
      screen: withMappedNavigationProps(Thread),
      navigationOptions: {
        headerTitle: 'Thread',
      },
    },
  },
  {
    initialRouteName: 'Notifications',
  }
);

export default NotificationsNavigator;
