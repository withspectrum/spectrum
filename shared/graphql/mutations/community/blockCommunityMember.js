// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { getCommunityMemberConnectionQuery } from '../../queries/community/getCommunityMemberConnection';

export type BlockCommunityMemberType = {
  data: {
    blockCommunityMember: boolean,
  },
};

export const blockCommunityMemberQuery = gql`
  mutation blockCommunityMember($input: BlockCommunityMemberInput!) {
    blockCommunityMember(input: $input)
  }
`;

const blockCommunityMemberOptions = {
  props: ({ mutate, ownProps }) => ({
    blockCommunityMember: ({ input }) =>
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
                      isBlocked: true,
                      isMember: false,
                      isModerator: false,
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

export default graphql(blockCommunityMemberQuery, blockCommunityMemberOptions);
