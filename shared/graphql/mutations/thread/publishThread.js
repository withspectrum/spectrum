// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import threadInfoFragment from '../../fragments/thread/threadInfo';
import type { ThreadInfoType } from '../../fragments/thread/threadInfo';

export type PublishThreadType = {
  ...$Exact<ThreadInfoType>,
  channel: {
    id: string,
    slug: string,
    community: {
      id: string,
      slug: string,
    },
  },
};

type Attachment = {
  attachmentType: string,
  data: string,
};

type File = {
  name: string,
  type: string,
  size: number,
  path: string,
};

type PublishThreadInput = {
  channelId: string,
  communityId: string,
  type: 'SLATE' | 'DRAFTJS',
  content: {
    title: string,
    body?: string,
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>,
};

export const publishThreadMutation = gql`
  mutation publishThread($thread: ThreadInput!) {
    publishThread(thread: $thread) {
      ...threadInfo
      channel {
        id
        slug
        community {
          id
          slug
        }
      }
    }
  }
  ${threadInfoFragment}
`;

const publishThreadOptions = {
  props: ({ thread, mutate }) => ({
    publishThread: (thread: PublishThreadInput) =>
      mutate({
        variables: {
          thread,
        },
      }),
  }),
};

export default graphql(publishThreadMutation, publishThreadOptions);
