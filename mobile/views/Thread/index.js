// @flow
import * as React from 'react';
import { View, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import Text from '../../components/Text';
import ThreadContent from '../../components/ThreadContent';

import { Wrapper } from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  data: {
    thread?: {
      id: string,
      content: {
        body?: string,
        title: string,
      },
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
          <ScrollView style={{ flex: 1 }} testID="e2e-thread">
            <Text type="title1">
              {data.thread.content.title} by {data.thread.creator.name}
            </Text>
            {data.thread.content.body && (
              <ThreadContent
                rawContentState={JSON.parse(data.thread.content.body)}
              />
            )}
          </ScrollView>
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text type="body">Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-thread">
            <Text type="body">Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(withSafeView, getThreadById, ViewNetworkHandler)(Thread);
