// @flow
import { createStackNavigator } from 'react-navigation';
import BaseStack from './BaseStack';
import Search from '../Search';

const DMStack = createStackNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: ({ navigation }) => ({
        headerTitle: null,
        headerStyle: {
          backgroundColor: 'transparent',
          right: 0,
          left: 0,
          top: 0,
          position: 'absolute',
          width: 0,
          height: 0,
        },
        headerTintColor: 'white',
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'Search',
  }
);

export default DMStack;
