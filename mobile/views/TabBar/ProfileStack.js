// @flow
import { createStackNavigator } from 'react-navigation';
import BaseStack from './BaseStack';

const ProfileStack = createStackNavigator(
  {
    ...BaseStack,
  },
  {
    initialRouteName: 'User',
  }
);

export default ProfileStack;
