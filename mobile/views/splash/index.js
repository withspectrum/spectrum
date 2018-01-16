// @flow
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import compose from 'recompose/compose';
import getCommunityById from '../../gql/community/queries/getCommunity';
import ViewNetworkHandler from '../../components/viewNetworkHandler';
import withSafeView from '../../components/safeAreaView';

import { Wrapper } from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  data: {
    community?: {
      name: string,
    },
  },
};
class Splash extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError } = this.props;
    console.log('SPLASH PRPS', this.props);

    return (
      <Wrapper>
        <View testID="welcome">
          <Button
            title={'thread one'}
            onPress={() =>
              this.props.navigation.navigate(`Thread`, {
                id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
              })
            }
          />
          <Button
            title={'community one'}
            onPress={() =>
              this.props.navigation.navigate(`Community`, {
                id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
              })
            }
          />
          <Button
            title={'thread two'}
            onPress={() =>
              this.props.navigation.navigate(`Thread`, {
                id: '11e736b3-5464-4bab-acfd-bbd42cddc1dd',
              })
            }
          />
        </View>
      </Wrapper>
    );

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="welcome">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="welcome">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(withSafeView, getCommunityById, ViewNetworkHandler)(
  Splash
);
