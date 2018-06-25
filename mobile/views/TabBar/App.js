// @flow
import React from 'react';
import { Button } from 'react-native';
import {
  createStackNavigator,
  type NavigationScreenConfigProps,
} from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import TabBar from './TabBar';
import Close from './headerActions/Close';
import DirectMessageComposer from '../DirectMessageComposer';
import ThreadComposerModal from '../ThreadComposerModal';

const AppStack = createStackNavigator(
  {
    /*
      This loads the tab navigator, which is the entire app itself. This is
      the default route that gets loaded and all subroutes are contained
      within. 
    */
    TabBar: {
      screen: TabBar,
      navigationOptions: {
        header: null,
      },
    },

    /*
      This is where globally accessible modals should go. If a modal needs
      to be accessed from multiple views - e.g. you might initiate a direct
      message from the direct messages tab, but also from a user profile - 
      those modals should appear here.
    */
    ThreadComposer: {
      screen: withMappedNavigationProps(ThreadComposerModal),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: navigation.getParam('title', 'Compose'),
        headerLeft: () => (
          <Close
            onPress={navigation.getParam('onThreadComposerCancel', () =>
              navigation.goBack()
            )}
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
    DirectMessageComposer: {
      screen: withMappedNavigationProps(DirectMessageComposer),
      navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
        headerTitle: navigation.getParam('title', 'New Message'),
        headerLeft: ({ onPress }) => <Button onPress={onPress} title="Close" />,
      }),
    },
  },
  {
    initialRouteName: 'TabBar',
    mode: 'modal',
  }
);

export default AppStack;
