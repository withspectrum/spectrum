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

/*
  Get all media messages for a threadId to populate the gallery
*/
const GET_GALLERY_QUERY = gql`
  query getThreadGallery($id: ID!) {
    thread(id: $id) {
      id
      gallery {
        id
        src
      }
    }
  }
`;

const GET_GALLERY_OPTIONS = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data: { error, loading, thread } }) => ({
    data: {
      error,
      loading,
      images: thread ? thread.gallery : [],
    },
  }),
};

export const getGalleryForThread = graphql(
  GET_GALLERY_QUERY,
  GET_GALLERY_OPTIONS
);
