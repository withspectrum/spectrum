// @flow
import * as React from 'react';
import { Text, View } from 'react-native';
import compose from 'recompose/compose';
import getThreadById from '../../gql/thread/queries/getThreadById';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';

import { Wrapper } from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  data: {
    thread?: {
      id: string,
      creator: {
        name: string,
      },
    },
  },
};
class Thread extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.thread) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text>
              Now viewing thread {data.thread.id} by {data.thread.creator.name}
            </Text>
          </View>
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(withSafeView, getThreadById, ViewNetworkHandler)(Thread);
