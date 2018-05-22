// @flow
import { StackNavigator } from 'react-navigation';
import BaseStack from './BaseStack';

const ProfileStack = StackNavigator(
  {
    ...BaseStack,
  },
  {
    initialRouteName: 'User',
  }
);

export default ProfileStack;
