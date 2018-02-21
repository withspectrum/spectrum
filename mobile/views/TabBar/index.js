// @flow
import { TabNavigator, TabBarBottom } from 'react-navigation';
import theme from '../../components/theme';

// Stacks for the individual views
import HomeStack from './HomeStack';
import NotificationsStack from './NotificationsStack';

const routeConfiguration = {
  Home: { screen: HomeStack },
  Messages: { screen: HomeStack },
  Explore: { screen: HomeStack },
  Notifications: { screen: NotificationsStack },
  Profile: { screen: HomeStack },
};

const tabBarConfiguration = {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarOptions: {
    // tint color is passed to text and icons (if enabled) on the tab bar
    activeTintColor: theme.bg.default,
    inactiveTintColor: theme.text.placeholder,
    // background color is for the tab component
    activeBackgroundColor: theme.bg.reverse,
    inactiveBackgroundColor: theme.bg.reverse,
  },
};

export default TabNavigator(routeConfiguration, tabBarConfiguration);
