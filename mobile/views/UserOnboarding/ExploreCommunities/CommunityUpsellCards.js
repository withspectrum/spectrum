// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import CommunityProfileCard from './CommunityProfileCard';
import { CommunityCardListScrollView } from './style';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';
import {
  getCommunitiesByCuratedContentType,
  type GetCommunitiesType,
} from '../../../../shared/graphql/queries/community/getCommunities';
import ExploreContext from './context';
import { LoadingCard } from './CommunityProfileCard';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  data: {
    communities: GetCommunitiesType,
  },
};

class CommunityUpsellCards extends React.Component<Props> {
  render() {
    const { data, isLoading } = this.props;

    if (data.communities) {
      return (
        <CommunityCardListScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {data.communities.map(
            community =>
              community && (
                <ExploreContext.Consumer key={community.id}>
                  {ctx => (
                    <CommunityProfileCard {...ctx} community={community} />
                  )}
                </ExploreContext.Consumer>
              )
          )}
        </CommunityCardListScrollView>
      );
    }

    if (isLoading) {
      return (
        <CommunityCardListScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </CommunityCardListScrollView>
      );
    }

    return null;
  }
}

export default compose(getCommunitiesByCuratedContentType, ViewNetworkHandler)(
  CommunityUpsellCards
);
