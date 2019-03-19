// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';

type Props = {
  data: {
    fetchMore: Function,
    community: GetCommunityMembersType,
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

export default compose(
  getCommunityMembersQuery,
  viewNetworkHandler
)(CommunityMembers);
