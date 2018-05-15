// @flow
import { StackNavigator } from 'react-navigation';
import Notifications from '../Notifications';
import BaseStack from './BaseStack';

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
