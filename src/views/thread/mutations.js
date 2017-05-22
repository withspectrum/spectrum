// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  reactionInfoFragment,
} from '../../api/fragments/reaction/reactionInfo';

/*
  Send an id and boolean value to set a thread to be locked or unlocked.
  Returns the thread ID and locked value.

  Updates UI automatically via the Apollo ObjectID cache
*/
const SET_THREAD_LOCK_MUTATION = gql`
  mutation setThreadLock($id: ID!, $value: Boolean!) {
    setThreadLock(id: $id, value: $value) {
      id
      locked
    }
  }
`;
const SET_THREAD_LOCK_OPTIONS = {
  props: ({ mutate }) => ({
    setThreadLock: ({ id, value }) =>
      mutate({
        variables: {
          id,
          value,
        },
      }),
  }),
};
export const setThreadLockMutation = graphql(
  SET_THREAD_LOCK_MUTATION,
  SET_THREAD_LOCK_OPTIONS
);

/*
  Toggles a reaction on a specific message. The reaction object is created
  in /components/chatMessages because that is a dumb component which might
  be rendering messages from a thread or direct message thread. The reaction
  object takes a 'type' and a 'message' id.

  We run 'refetchQueries' on the current thread query in order to update
  the UI to reflect the new reaction.
*/
const TOGGLE_REACTION_MUTATION = gql`
  mutation toggleReaction($reaction: ReactionInput!) {
    toggleReaction(reaction: $reaction) {
      ...reactionInfo
      __typename
    }
  }
  ${reactionInfoFragment}
`;
const TOGGLE_REACTION_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    // renames the mutate method to 'toggleReaction' and accepts an argument
    // of the reaction object. This helps us keep the mutation logic out of
    // the component
    toggleReaction: reaction =>
      mutate({
        variables: {
          reaction,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          toggleReaction: {
            id: Math.random() * -10000,
            type: 'like',
            user: {
              id: ownProps.currentUser.id,
              __typename: 'User',
            },
            __typename: 'Reaction',
          },
        },
        // update: (store, { data: { toggleReaction }}) => {
        //   const data = store.readQuery({ query: GET_THREAD_MESSAGES_QUERY })
        //   console.log('updating', data)
        // }
      }),
    //   updateQueries: {
    //     getThreadMessages: (prev, { mutationResult }) => {
    //       const newReaction = mutationResult.data.toggleReaction;
    //       console.log('in the reaction update', prev, newReaction)
    //       return Object.assign({}, prev, {
    //         ...prev,
    //         thread: {
    //           ...prev.thread,
    //           messageConnection: {
    //             ...prev.thread.messageConnection,
    //             edges: prev.thread.messageConnection.edges.map(edge => {
    //               // make sure we're modifying the correct message
    //               if (edge.node.id !== reaction.message) return edge;
    //
    //               // if no reactions exist yet, add one immediately for the
    //               // current user
    //               if (edge.node.reactions.length === 0) {
    //                 return {
    //                   ...edge,
    //                   node: {
    //                     ...edge.node,
    //                     reactions: [...edge.node.reactions, newReaction],
    //                   },
    //                 };
    //               }
    //
    //               // if the current user has already reacted, remove their
    //               // reaction from the array
    //               if (
    //                 edge.node.reactions.find(r => {
    //                   return r.user.id === newReaction.user.id;
    //                 })
    //               ) {
    //                 return {
    //                   ...edge,
    //                   node: {
    //                     ...edge.node,
    //                     reactions: edge.node.reactions.filter(r => {
    //                       return r.user.id !== newReaction.user.id;
    //                     }),
    //                   },
    //                 };
    //               }
    //
    //               // otherwise add the reaction
    //               return {
    //                 ...edge,
    //                 node: {
    //                   ...edge.node,
    //                   reactions: [...edge.node.reactions, newReaction],
    //                 },
    //               };
    //             }),
    //           },
    //         },
    //       });
    //     },
    //   },
    // }),
  }),
};
export const toggleReactionMutation = graphql(
  TOGGLE_REACTION_MUTATION,
  TOGGLE_REACTION_OPTIONS
);
