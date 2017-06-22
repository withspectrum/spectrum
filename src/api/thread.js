// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { threadInfoFragment } from './fragments/thread/threadInfo';

/*
  Delete a thread
*/
const DELETE_THREAD_MUTATION = gql`
  mutation deleteThread($threadId: ID!) {
    deleteThread(threadId: $threadId)
  }
`;
const DELETE_THREAD_OPTIONS = {
  props: ({ threadId, mutate }) => ({
    deleteThread: threadId =>
      mutate({
        variables: {
          threadId,
        },
      }),
  }),
};
export const deleteThreadMutation = graphql(
  DELETE_THREAD_MUTATION,
  DELETE_THREAD_OPTIONS
);

/*
  Edit a thread
*/
const EDIT_THREAD_MUTATION = gql`
  mutation editThread($input: EditThreadInput!) {
    editThread(input: $input) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;
const EDIT_THREAD_OPTIONS = {
  props: ({ input, mutate }) => ({
    editThread: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};
export const editThreadMutation = graphql(
  EDIT_THREAD_MUTATION,
  EDIT_THREAD_OPTIONS
);

const getThreadByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getThreadById = graphql(
  gql`
		query getThread($id: ID!) {
			thread(id: $id) {
        ...threadInfo
      }
		}
    ${threadInfoFragment}
	`,
  getThreadByIdOptions
);
