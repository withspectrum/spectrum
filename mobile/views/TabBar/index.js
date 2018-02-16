// @flow
import { TabNavigator, TabBarBottom } from 'react-navigation';
import theme from '../../components/theme';
// Tab-Navigators
import HomeNavigation from './HomeNavigation';
// import MessagesNavigation from './MessagesNavigation'
import NotificationsNavigation from './NotificationsNavigation';
// import ExploreNavigation from './ExploreNavigation'
// import ProfileNavigation from './ProfileNavigation'

const routeConfiguration = {
  Home: { screen: HomeNavigation },
  Messages: { screen: HomeNavigation },
  Explore: { screen: HomeNavigation },
  Notifications: { screen: NotificationsNavigation },
  Profile: { screen: HomeNavigation },
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
