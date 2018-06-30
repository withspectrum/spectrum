// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import Dashboard from '../Dashboard';
import BaseStack from './BaseStack';
import Compose from './headerActions/Compose';
import type { NavigationScreenConfigProps } from 'react-navigation';

const HomeStack = createStackNavigator(
  {
    Dashboard: {
      screen: withMappedNavigationProps(Dashboard),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: 'Home',
        headerRight: (
          <Compose onPress={() => navigation.navigate('ThreadComposer')} />
        ),
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'Dashboard',
  }
);

export default HomeStack;
