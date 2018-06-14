// @flow
import React from 'react';
import { SafeAreaView } from 'react-native';
import compose from 'recompose/compose';
import Text from '../../components/Text';
import Loading from '../../components/Loading';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import {
  getCommunitiesByCuratedContentType,
  type GetCommunitiesType,
} from '../../../shared/graphql/queries/community/getCommunities';

import styled from 'styled-components/native';

const Wrapper = styled.View`
  align-items: center;
`;

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  data: {
    communities: ?GetCommunitiesType,
  },
};

class ExploreCommunities extends React.Component<Props> {
  render() {
    const { isLoading, data } = this.props;
    if (isLoading) return <Loading />;
    return (
      <SafeAreaView>
        <Wrapper>
          <Text type="title1" bold>
            Find your people.
          </Text>
          <Text
            type="headline"
            style={{ textAlign: 'center' }}
            color={({ theme }) => theme.text.alt}
          >
            There are thousands of communities on Spectrum to explore. Check out
            some of our favorites below or search for topics you love!
          </Text>
        </Wrapper>
      </SafeAreaView>
    );
  }
}

export default compose(getCommunitiesByCuratedContentType, ViewNetworkHandler)(
  ExploreCommunities
);
