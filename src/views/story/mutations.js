import { graphql, gql } from 'react-apollo';
import { messageInfoFragment } from '../../api/fragments/message/messageInfo';
import {
  reactionInfoFragment,
} from '../../api/fragments/reaction/reactionInfo';
import { getStoryMessagesQuery } from './queries';

/*
  Send an id and boolean value to set a story to be locked or unlocked.
  Returns the story ID and locked value.

  Updates UI automatically via the Apollo ObjectID cache
*/
const SET_STORY_LOCK_MUTATION = gql`
  mutation setStoryLock($id: ID!, $value: Boolean!) {
    setStoryLock(id: $id, value: $value) {
      id
      locked
    }
  }
`;
const SET_STORY_LOCK_OPTIONS = {
  props: ({ mutate }) => ({
    setStoryLock: ({ id, value }) =>
      mutate({
        variables: {
          id,
          value,
        },
      }),
  }),
};
export const setStoryLock = graphql(
  SET_STORY_LOCK_MUTATION,
  SET_STORY_LOCK_OPTIONS
);

/*
  Sends a message to a story (location is 'messages', which means we are
  in a story).

  Updates UI automatically via the containers subscribeToNewMessages helper
*/
const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($message: MessageInput!) {
    addMessage(location: messages, message: $message) {
      ...messageInfo
    }
  }
  ${messageInfoFragment}
`;
export const sendMessage = graphql(SEND_MESSAGE_MUTATION);

/*
  Toggles a reaction on a specific message. The reaction object is created
  in /components/chatMessages because that is a dumb component which might
  be rendering messages from a story or direct message thread. The reaction
  object takes a 'type' and a 'message' id.

  We run 'refetchQueries' on the current story query in order to update
  the UI to reflect the new reaction.
*/
const TOGGLE_REACTION_MUTATION = gql`
  mutation toggleReaction($reaction: ReactionInput!) {
    toggleReaction(reaction: $reaction) {
      ...reactionInfo
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
        // listens for a reaction to change and refetches the query to get all
        // the story messages
        // in the future we should do better optimistic UI transformations so that
        // there won't any lag between the user reacting and the UI updating
        refetchQueries: [
          {
            query: getStoryMessagesQuery,
            variables: { id: ownProps.id },
          },
        ],
      }),
  }),
};
export const toggleReaction = graphql(
  TOGGLE_REACTION_MUTATION,
  TOGGLE_REACTION_OPTIONS
);
