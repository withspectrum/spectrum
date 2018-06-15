// @flow
import React from 'react';
import compose from 'recompose/compose';
import Loading from '../../components/Loading';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import {
  getCommunitiesByCuratedContentType,
  type GetCommunitiesType,
} from '../../../shared/graphql/queries/community/getCommunities';
import { UserOnboardingWrapper, ViewTitle, ViewSubtitle } from './style';

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
      <UserOnboardingWrapper>
        <ViewTitle>Find your people.</ViewTitle>

        <ViewSubtitle>
          To get started, let’s find some communities for you to join. Check out
          some of our favorites, or search for topics like "design"
        </ViewSubtitle>
      </UserOnboardingWrapper>
    );
  }
}

export default compose(getCommunitiesByCuratedContentType, ViewNetworkHandler)(
  ExploreCommunities
);
