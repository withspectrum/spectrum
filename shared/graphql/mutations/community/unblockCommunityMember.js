// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCommunityMemberConnectionQuery } from '../../queries/community/getCommunityMemberConnection';
import { searchCommunityMembersQuery } from '../../queries/search/searchCommunityMembers';

export type UnblockCommunityMemberType = {
  data: {
    unblockCommunityMember: boolean,
  },
};

export const unblockCommunityMemberQuery = gql`
  mutation unblockCommunityMember($input: UnblockCommunityMemberInput!) {
    unblockCommunityMember(input: $input)
  }
`;

const unblockCommunityMemberOptions = {
  props: ({ mutate, ownProps }) => ({
    unblockCommunityMember: ({ input }) =>
      mutate({
        variables: {
          input,
        },
        update: store => {
          const data = store.readQuery({
            query: getCommunityMemberConnectionQuery,
            variables: {
              id: ownProps.community.id,
            },
          });

          data.community.memberConnection.edges = data.community.memberConnection.edges.map(
            edge => {
              if (edge.node.id === input.userId) {
                return {
                  ...edge,
                  node: {
                    ...edge.node,
                    contextPermissions: {
                      ...edge.node.contextPermissions,
                      isModerator: false,
                      isMember: true,
                      isBlocked: false,
                    },
                  },
                };
              }
              return edge;
            }
          );

          store.writeQuery({
            query: getCommunityMemberConnectionQuery,
            data,
            variables: {
              id: ownProps.community.id,
            },
          });

          /*
            It's possible that the user's permission is being modified from a search
            result - if that's the case, try to update the search result query 
            cache, but with a try catch in case the query doesn't exist in the store
          */
          try {
            const searchData = store.readQuery({
              query: searchCommunityMembersQuery,
              variables: {
                type: 'USERS',
              },
            });

            if (searchData) {
              searchData.search.searchResultsConnection.edges = searchData.search.searchResultsConnection.edges.map(
                edge => {
                  if (edge.node.id === input.userId) {
                    return {
                      ...edge,
                      node: {
                        ...edge.node,
                        contextPermissions: {
                          ...edge.node.contextPermissions,
                          isModerator: false,
                          isMember: true,
                          isBlocked: false,
                        },
                      },
                    };
                  }
                  return edge;
                }
              );

              // Write our data back to the cache.
              store.writeQuery({
                query: searchCommunityMembersQuery,
                data: searchData,
                variables: {
                  type: 'USERS',
                },
              });
            }
          } catch (err) {
            return;
          }
        },
      }),
  }),
};

export default graphql(
  unblockCommunityMemberQuery,
  unblockCommunityMemberOptions
);
