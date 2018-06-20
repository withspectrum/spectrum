// @flow
import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import Dashboard from '../Dashboard';
import BaseStack from './BaseStack';
import ThreadComposerModal from '../ThreadComposerModal';
import type { NavigationScreenConfigProps } from 'react-navigation';

const HomeStack = createStackNavigator(
  {
    Dashboard: {
      screen: withMappedNavigationProps(Dashboard),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: 'Home',
        headerRight: (
          <Button
            onPress={() => navigation.navigate('ThreadComposer')}
            title="New"
          />
        ),
      }),
    },
    ...BaseStack,
  },
  {
    initialRouteName: 'Dashboard',
  }
);

// We want the ThreadComposer to open as a modal, so we create another stack navigator that wraps the above base
// stack in a modal stack navigator with no header. See https://reactnavigation.org/docs/en/modal.html for more info
const ModalStack = createStackNavigator(
  {
    Home: {
      screen: HomeStack,
      // We don't want to show two headers, so we hide the header of the second stack here
      navigationOptions: {
        header: null,
      },
    },
    ThreadComposer: {
      screen: withMappedNavigationProps(ThreadComposerModal),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: navigation.getParam('title', 'Compose'),
        headerLeft: () => (
          <Button
            onPress={navigation.getParam('onThreadComposerCancel', () =>
              navigation.goBack()
            )}
            title="Cancel"
          />
        ),
        headerRight: (
          <Button
            title="Publish"
            disabled={navigation.getParam('publishDisabled', true)}
            onPress={navigation.getParam('onPublish', () => {})}
          />
        ),
      }),
    },
  },
  {
    mode: 'modal',
  }
);

export default ModalStack;
