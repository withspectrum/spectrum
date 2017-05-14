// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';

/*
  Delete a story
*/
const DELETE_STORY_MUTATION = gql`
  mutation deleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`;
const DELETE_STORY_OPTIONS = {
  props: ({ id, mutate }) => ({
    deleteStory: id =>
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
