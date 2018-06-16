// @flow
import * as React from 'react';
import type { NavigationProps } from 'react-navigation';
import { Button } from 'react-native';

type Props = {
  navigation: NavigationProps,
};

export default class NavigateToThreadDetails extends React.Component<Props> {
  navigate = () => {
    const { navigation } = this.props;
    return navigation.navigate({
      routeName: `ThreadDetail`,
      key: `thread-detail-${navigation.state.key}`,
      params: { id: navigation.state.params.id },
    });
  };
  render() {
    return <Button onPress={this.navigate} title="Details" />;
  }
}
