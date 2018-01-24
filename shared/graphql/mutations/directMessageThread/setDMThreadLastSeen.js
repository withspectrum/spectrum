// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import directMessageThreadInfoFragment from '../../fragments/directMessageThread/directMessageThreadInfo';
import type { DirectMessageThreadInfoType } from '../../fragments/directMessageThread/directMessageThreadInfo';

export type SetDMLastSeenType = {
  ...$Exact<DirectMessageThreadInfoType>,
};

export const setLastSeenMutation = gql`
  mutation setLastSeen($id: ID!) {
    setLastSeen(id: $id) {
      ...directMessageThreadInfo
    }
  }
  ${directMessageThreadInfoFragment}
`;
const SsetLastSeenOptions = {
  props: ({ mutate }) => ({
    setLastSeen: id =>
      mutate({
        variables: {
          id,
        },
      }),
  }),
};
export default graphql(setLastSeenMutation, SsetLastSeenOptions);
