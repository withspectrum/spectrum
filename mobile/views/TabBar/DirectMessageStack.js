// @flow
import { createStackNavigator } from 'react-navigation';
import idx from 'idx';
import BaseStack from './BaseStack';
import DirectMessages from '../DirectMessages';
import DirectMessageThread from '../DirectMessageThread';

const DMStack = createStackNavigator(
  {
    DirectMessages: {
      screen: DirectMessages,
      navigationOptions: ({ navigation }) => ({
        headerTitle: idx(navigation, _ => _.state.params.title) || 'Messages',
      }),
    },
    DirectMessageThread: {
      screen: DirectMessageThread,
      navigationOptions: ({ navigation }) => ({
        headerTitle: idx(navigation, _ => _.state.params.title) || '',
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'DirectMessages',
  }
);

export default DMStack;
