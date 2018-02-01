// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCommunityMemberConnectionQuery } from '../../queries/community/getCommunityMemberConnection';

export type AddCommunityModeratorType = {
  data: {
    addCommunityModerator: boolean,
  },
};

export const addCommunityModeratorQuery = gql`
  mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
    addCommunityModerator(input: $input)
  }
`;

const addCommunityModeratorOptions = {
  props: ({ mutate, ownProps }) => ({
    addCommunityModerator: ({ input }) =>
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
                      isModerator: true,
                      isBlocked: false,
                      isMember: true,
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
  addCommunityModeratorQuery,
  addCommunityModeratorOptions
);
