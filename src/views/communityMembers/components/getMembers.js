// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import type { ViewNetworkHandlerType } from '../../../components/viewNetworkHandler';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMemberConnection';
import type { GetCommunityMemberConnectionType } from 'shared/graphql/queries/community/getCommunityMemberConnection';

type Props = {
  data: {
    fetchMore: Function,
    community: GetCommunityMemberConnectionType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  render: Function,
};

class CommunityMembers extends React.Component<Props> {
  render() {
    const {
      data: { community, fetchMore },
      isLoading,
      isFetchingMore,
    } = this.props;

    return this.props.render({
      community,
      isLoading,
      isFetchingMore,
      fetchMore,
    });
  }
}

export default compose(getCommunityMembersQuery, viewNetworkHandler)(
  CommunityMembers
);
