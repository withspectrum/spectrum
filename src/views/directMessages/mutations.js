// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  reactionInfoFragment,
} from '../../api/fragments/reaction/reactionInfo';

/*
  Toggles a reaction on a specific message. The reaction object is created
  in /components/chatMessages because that is a dumb component which might
  be rendering messages from a directMessageGroup or direct message thread. The reaction
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
          getDirectMessageGroupMessages: (prev, { mutationResult }) => {
            const newReaction = mutationResult.data.toggleReaction;

            return Object.assign({}, prev, {
              ...prev,
              directMessageGroup: {
                ...prev.directMessageGroup,
                messageConnection: {
                  ...prev.directMessageGroup.messageConnection,
                  edges: prev.directMessageGroup.messageConnection.edges.map(
                    edge => {
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
                    }
                  ),
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
