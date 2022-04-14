// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import searchCommunityMembers from 'shared/graphql/queries/search/searchCommunityMembers';
import type { SearchCommunityMembersType } from 'shared/graphql/queries/search/searchCommunityMembers';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';

type Props = {
  data: {
    search: SearchCommunityMembersType,
  },
  ...$Exact<ViewNetworkHandlerType>,
  render: Function,
};

class Search extends React.Component<Props> {
  render() {
    const { isLoading, data } = this.props;
    const searchResults =
      !isLoading &&
      data.search &&
      data.search.searchResultsConnection.edges.map(edge => edge && edge.node);
    return this.props.render({ searchResults, isLoading });
  }
}

export default compose(
  searchCommunityMembers,
  viewNetworkHandler
)(Search);
