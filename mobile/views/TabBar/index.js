// @flow
import { TabNavigator } from 'react-navigation';
// Tab-Navigators
import HomeNavigator from './HomeNavigator';

const routeConfiguration = {
  Home: { screen: HomeNavigator },
  Messages: { screen: HomeNavigator },
  Explore: { screen: HomeNavigator },
  Notifications: { screen: HomeNavigator },
  Profile: { screen: HomeNavigator },
};

const tabBarConfiguration = {
  tabBarOptions: {
    activeTintColor: 'white',
    inactiveTintColor: 'blue',
    activeBackgroundColor: 'blue',
    inactiveBackgroundColor: 'white',
  },
};

export default TabNavigator(routeConfiguration, tabBarConfiguration);
