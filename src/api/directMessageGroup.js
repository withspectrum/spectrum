// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  directMessageGroupInfoFragment,
} from './fragments/directMessageGroup/directMessageGroupInfo';
import {
  userDirectMessageGroupsFragment,
} from './fragments/user/userDirectMessageGroups';

/*
  Create a new direct message group
*/
const CREATE_DIRECT_MESSAGE_GROUP_MUTATION = gql`
  mutation createDirectMessageGroup($input: DirectMessageGroupInput!) {
    createDirectMessageGroup(input: $input) {
      ...directMessageGroupInfo
    }
  }
  ${directMessageGroupInfoFragment}
`;
const CREATE_DIRECT_MESSAGE_GROUP_OPTIONS = {
  props: ({ input, mutate }) => ({
    createDirectMessageGroup: input =>
      mutate({
        variables: {
          input,
        },
        // NOTE: I tried each of the three methods to update the Apollo store
        // and couldn't get any of them to work. Very frustrating that this
        // is so difficult.
        // refetchQueries: [{
        //   query: GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY
        // }]
        // update: (store, { data: { createDirectMessageGroup } }) => {
        //   const data = store.readQuery({ query: GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY })
        //   console.log('data', data)
        //   console.log('returned data', createDirectMessageGroup)
        //   data.user.directMessageGroupsConnection.edges.push({
        //     node: createDirectMessageGroup
        //   })
        //   console.log('post-push: ', data)
        //   store.writeQuery({ query: GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY, data })
        // }
        // updateQueries: {
        //   getCurrentUserDirectMessageGroups: (prev, { mutationResult }) => {
        //     const newGroup = mutationResult.data.createDirectMessageGroup;
        //
        //     return Object.assign({}, prev, {
        //       ...prev,
        //       user: {
        //         ...prev.user,
        //         directMessageGroupsConnection: {
        //           ...prev.user.directMessageGroupsConnection,
        //           edges: [
        //             ...prev.user.directMessageGroupsConnection.edges,
        //             {
        //               node: {
        //                 ...newGroup
        //               }
        //             }
        //           ]
        //         }
        //       }
        //     });
        //   },
        // },
      }),
  }),
};
export const createDirectMessageGroupMutation = graphql(
  CREATE_DIRECT_MESSAGE_GROUP_MUTATION,
  CREATE_DIRECT_MESSAGE_GROUP_OPTIONS
);

export const GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY = gql`
  query currentUserDirectMessageGroups {
    user: currentUser {
      ...userDirectMessageGroups
    }
  }
  ${userDirectMessageGroupsFragment}
`;

export const getCurrentUserDirectMessageGroups = graphql(
  GET_CURRENT_USER_DIRECT_MESSAGE_GROUPS_QUERY
);
