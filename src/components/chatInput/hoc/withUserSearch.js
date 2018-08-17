import { withStateHandlers, compose, withProps } from 'recompose';
import searchUsers from 'shared/graphql/queries/search/searchUsers';
import { flatMap, map } from 'lodash';

const withUserSearch = withStateHandlers(
  {
    queryString: '',
  },
  {
    search: prev => value => {
      return {
        queryString: value,
      };
    },
  }
);

const mapUserProps = withProps(({ data, error, loading, queryString }) => {
  const users = data.search
    ? map(data.search.searchResultsConnection.edges, edge => {
        return edge.node;
      })
    : [];
  return {
    users,
    loading,
    error,
  };
});
export default compose(
  withUserSearch,
  searchUsers,
  mapUserProps
);
