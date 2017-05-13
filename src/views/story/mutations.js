// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { messageInfoFragment } from '../../api/fragments/message/messageInfo';
import {
  reactionInfoFragment,
} from '../../api/fragments/reaction/reactionInfo';

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
export const setStoryLockMutation = graphql(
  SET_STORY_LOCK_MUTATION,
  SET_STORY_LOCK_OPTIONS
);

/*
  Delete a story
*/
const DELETE_STORY_MUTATION = gql`
  mutation deleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`;
const DELETE_STORY_OPTIONS = {
  props: ({ mutate }) => ({
    deleteStory: ({ id }) =>
      mutate({
        variables: {
          id,
        },
      }),
  }),
};
export const deleteStoryMutation = graphql(
  DELETE_STORY_MUTATION,
  DELETE_STORY_OPTIONS
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
const SEND_MESSAGE_OPTIONS = {
  props: ({ ownProps, mutate }) => ({
    sendMessage: message =>
      mutate({
        variables: {
          message,
        },
      }),
  }),
};
export const sendMessageMutation = graphql(
  SEND_MESSAGE_MUTATION,
  SEND_MESSAGE_OPTIONS
);

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
              uid: ownProps.currentUser.uid,
              __typename: 'User',
            },
            __typename: 'Reaction',
          },
        },
        updateQueries: {
          getStoryMessages: (prev, { mutationResult }) => {
            const newReaction = mutationResult.data.toggleReaction;

            return Object.assign({}, prev, {
              ...prev,
              story: {
                ...prev.story,
                messageConnection: {
                  ...prev.story.messageConnection,
                  edges: prev.story.messageConnection.edges.map(edge => {
                    // make sure we're modifying the correct message
                    if (edge.node.id !== reaction.message) return edge;

                    // if no reactions exist yet, add one immediately for the
                    // current user
                    if (edge.node.reactions.length === 0) {
                      return {
                        ...edge,
                        node: {
                          ...edge.node,
                          reactions: [...edge.node.reactions, newReaction],
                        },
                      };
                    }

                    // if the current user has already reacted, remove their
                    // reaction from the array
                    if (
                      edge.node.reactions.find(r => {
                        return r.user.uid === newReaction.user.uid;
                      })
                    ) {
                      return {
                        ...edge,
                        node: {
                          ...edge.node,
                          reactions: edge.node.reactions.filter(r => {
                            return r.user.uid !== newReaction.user.uid;
                          }),
                        },
                      };
                    }

                    // otherwise add the reaction
                    return {
                      ...edge,
                      node: {
                        ...edge.node,
                        reactions: [...edge.node.reactions, newReaction],
                      },
                    };
                  }),
                },
              },
            });
          },
        },
      }),
  }),
};
export const toggleReactionMutation = graphql(
  TOGGLE_REACTION_MUTATION,
  TOGGLE_REACTION_OPTIONS
);
