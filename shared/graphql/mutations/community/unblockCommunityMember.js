// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCommunityMemberConnectionQuery } from '../../queries/community/getCommunityMemberConnection';

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
  unblockCommunityMemberQuery,
  unblockCommunityMemberOptions
);
