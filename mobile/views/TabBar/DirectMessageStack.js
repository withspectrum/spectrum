// @flow
import { createStackNavigator } from 'react-navigation';
import BaseStack from './BaseStack';
import DirectMessages from '../DirectMessages';
import DirectMessageThread from '../DirectMessageThread';

const DMStack = createStackNavigator(
  {
    DirectMessages: {
      screen: DirectMessages,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('title', 'Messages'),
      }),
    },
    DirectMessageThread: {
      screen: DirectMessageThread,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam('title', null),
        tabBarVisible: false,
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'DirectMessages',
  }
);

export default DMStack;
