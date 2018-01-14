// @flow
import { TabNavigator } from 'react-navigation';
import HomeNavigator from './HomeNavigator';
import theme from '../../components/theme';

const routeConfiguration = {
  Home: { screen: HomeNavigator },
  Messages: { screen: HomeNavigator },
  Explore: { screen: HomeNavigator },
  Notifications: { screen: HomeNavigator },
  Profile: { screen: HomeNavigator },
};

const tabBarConfiguration = {
  tabBarOptions: {
    activeTintColor: theme.bg.default,
    inactiveTintColor: theme.text.placeholder,
    activeBackgroundColor: theme.bg.reverse,
    inactiveBackgroundColor: theme.bg.reverse,
  },
};

export default TabNavigator(routeConfiguration, tabBarConfiguration);
