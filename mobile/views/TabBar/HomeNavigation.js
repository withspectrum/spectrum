// @flow
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import Thread from '../Thread';
import Splash from '../Splash';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

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
