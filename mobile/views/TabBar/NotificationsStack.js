// @flow
import { createStackNavigator } from 'react-navigation';
import Notifications from '../Notifications';
import BaseStack from './BaseStack';

const NotificationsStack = createStackNavigator(
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
