// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCommunityMemberConnectionQuery } from '../../queries/community/getCommunityMemberConnection';

export type RemoveCommunityModeratorType = {
  data: {
    removeCommunityModerator: boolean,
  },
};

export const removeCommunityModeratorQuery = gql`
  mutation removeCommunityModerator($input: RemoveCommunityModeratorInput!) {
    removeCommunityModerator(input: $input)
  }
`;

const removeCommunityModeratorOptions = {
  props: ({ mutate, ownProps }) => ({
    removeCommunityModerator: ({ input }) =>
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

          // Write our data back to the cache.
          store.writeQuery({
            query: getCommunityMemberConnectionQuery,
            data,
            variables: {
              id: ownProps.community.id,
            },
          });
        },
      }),
  }),
};

export default graphql(
  removeCommunityModeratorQuery,
  removeCommunityModeratorOptions
);
