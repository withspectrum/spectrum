// @flow
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Thread from './views/Thread';
import Splash from './views/Splash';

const createComponent = (component, props) => {
  return () => React.createElement(component, props);
};

const Routes = StackNavigator(
  {
    Splash: {
      screen: Splash,
      navigationOptions: {
        headerTitle: 'Home',
      },
    },
    Thread: {
      screen: Thread,
      navigationOptions: {
        headerTitle: 'Thread',
      },
    },
  },
  {
    initialRouteName: 'Splash',
  }
);

export default Routes;
