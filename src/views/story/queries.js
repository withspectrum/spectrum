// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { subscribeToNewMessages } from './subscriptions';
import { storyInfoFragment } from '../../api/fragments/story/storyInfo';
import { storyMessagesFragment } from '../../api/fragments/story/storyMessages';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import {
  frequencyMetaDataFragment,
} from '../../api/fragments/frequency/frequencyMetaData';

const getStoryQueryOptions = {
  options: ({ match }) => ({
    variables: { id: match.params.storyId },
  }),
  props: ({ data: { subscribeToMore, error, loading, story }, ownProps }) => ({
    data: {
      error,
      loading,
      story,
      subscribeToNewMessages: () =>
        subscribeToMore({
          document: subscribeToNewMessages,
          variables: {
            thread: ownProps.match.params.storyId,
          },
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newMessage = subscriptionData.data.messageAdded;

            // Add the new message to the data
            return {
              ...prev,
              story: {
                ...prev.story,
                messageConnection: {
                  ...prev.story.messageConnection,
                  edges: [
                    ...prev.story.messageConnection.edges,
                    // NOTE(@mxstbr): The __typename hack is to work around react-apollo/issues/658
                    { node: newMessage, __typename: 'StoryMessageEdge' },
                  ],
                },
              },
            };
          },
        }),
    },
  }),
};

export const getStory = graphql(
  gql`
    query story($id: ID!) {
      story(id: $id) {
        ...storyMessages
        ...storyInfo
        frequency {
          ...frequencyInfo
          ...frequencyMetaData
          community {
            ...communityInfo
          }
        }
      }
    }
    ${storyInfoFragment}
    ${storyMessagesFragment}
    ${communityInfoFragment}
    ${frequencyInfoFragment}
    ${frequencyMetaDataFragment}
  `,
  getStoryQueryOptions
);
