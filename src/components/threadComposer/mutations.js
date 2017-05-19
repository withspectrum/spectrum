// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { threadInfoFragment } from '../../api/fragments/thread/threadInfo';

export const publishThread = graphql(
  gql`
    mutation publishThread($thread: ThreadInput!) {
      publishThread(thread: $thread) {
        # When a thread is published, we want to return extra metadata about
        # the new thread to handle a few downstream operations:
        #
        # First, when a thread is published, we notify the dashboard 'everything'
        # query and insert the new thread into the threads list. That way if a
        # user publishes a thread and navigates to the homepage, their thread will
        # appear without needing to refetch
        #
        # Additionally, we want to get back the channelId and communityId
        # so that the community and channel the thread is posted under can
        # trigger their reducers and automatically add the new thread to the
        # store. See 'views/community/queries.js' for an example of this
        # reducer operation in use.
        #
        # The underlying goal here is to ensure that when a thread is published,
        # it will appear in all the feeds a user would expect it to appear
        # and play nicely with Apollo in th event that a feed was previously
        # fetched and cached
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
  `
);
