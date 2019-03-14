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
  props: ({ mutate }) => ({
    setCommunityLastSeen: (input: SetCommunityLastSeenInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  setCommunityLastSeenMutation,
  setCommunityLastSeenOptions
);
