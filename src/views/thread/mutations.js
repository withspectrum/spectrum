// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  reactionInfoFragment,
} from '../../api/fragments/reaction/reactionInfo';
import { messageInfoFragment } from '../../api/fragments/message/messageInfo';

/*
  Send an id and boolean value to set a thread to be locked or unlocked.
  Returns the thread ID and locked value.

  Updates UI automatically via the Apollo ObjectID cache
*/
const SET_THREAD_LOCK_MUTATION = gql`
  mutation setThreadLock($threadId: ID!, $value: Boolean!) {
    setThreadLock(threadId: $threadId, value: $value) {
      id
      isLocked
    }
  }
`;
const SET_THREAD_LOCK_OPTIONS = {
  props: ({ mutate }) => ({
    setThreadLock: ({ threadId, value }) =>
      mutate({
        variables: {
          threadId,
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
      ...messageInfo
      __typename
    }
  }
  ${messageInfoFragment}
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
      }),
  }),
};
export const toggleReactionMutation = graphql(
  TOGGLE_REACTION_MUTATION,
  TOGGLE_REACTION_OPTIONS
);
