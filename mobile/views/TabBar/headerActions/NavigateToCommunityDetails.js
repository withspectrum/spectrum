// @flow
import * as React from 'react';
import type { NavigationProps } from 'react-navigation';
import { Button } from 'react-native';

type Props = {
  navigation: NavigationProps,
};

export default class NavigateToCommunityDetails extends React.Component<Props> {
  navigate = () => {
    const { navigation } = this.props;
    return navigation.navigate({
      routeName: `CommunityDetail`,
      key: `community-detail-${navigation.state.key}`,
      params: { id: navigation.state.params.id },
    });
  };
  render() {
    return <Button onPress={this.navigate} title="Settings" />;
  }
}
