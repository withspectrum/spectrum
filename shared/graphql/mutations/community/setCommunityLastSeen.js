// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type SetCommunityLastSeenType = {
  data: {
    setCommunityLastSeen: {
      ...$Exact<CommunityInfoType>,
    },
  },
};

type SetCommunityLastSeenInput = {
  lastSeen: Date,
  id: string,
};

export const setCommunityLastSeenMutation = gql`
  mutation setCommunityLastSeen($input: SetCommunityLastSeenInput!) {
    setCommunityLastSeen(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const setCommunityLastSeenOptions = {
  props: ({ mutate, ownProps }) => ({
    setCommunityLastSeen: (input: SetCommunityLastSeenInput) =>
      mutate({
        variables: {
          input,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          setCommunityLastSeen: {
            __typename: 'Community',
            id: input.id,
            ...ownProps.community,
            communityPermissions: {
              ...ownProps.community.communityPermissions,
              __typename: 'CommunityPermissions',
              lastSeen: input.lastSeen.toISOString(),
            },
          },
        },
      }),
  }),
};

export default graphql(
  setCommunityLastSeenMutation,
  setCommunityLastSeenOptions
);
