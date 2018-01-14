// @flow
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Thread from './views/Thread';
import Splash from './views/Splash';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

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
      screen: withMappedNavigationProps(Thread),
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
