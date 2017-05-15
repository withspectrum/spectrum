import { graphql, gql } from 'react-apollo';
import { subscribeToNewMessages } from '../../api/subscriptions';
import { storyInfoFragment } from '../../api/fragments/story/storyInfo';
import { storyMessagesFragment } from '../../api/fragments/story/storyMessages';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';
import {
  frequencyMetaDataFragment,
} from '../../api/fragments/frequency/frequencyMetaData';

export const GET_STORY_QUERY = gql`
  query getStory($id: ID!) {
    story(id: $id) {
      ...storyInfo
      author {
        ...userInfo
        ...userMetaData
      }
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
  ${userInfoFragment}
  ${userMetaDataFragment}
  ${frequencyMetaDataFragment}
  ${frequencyInfoFragment}
  ${communityInfoFragment}
`;
export const GET_STORY_OPTIONS = {
  options: props => ({
    variables: {
      id: props.match.params.storyId,
    },
  }),
};
export const getStory = graphql(GET_STORY_QUERY, GET_STORY_OPTIONS);

export const GET_STORY_MESSAGES_QUERY = gql`
  query getStoryMessages($id: ID!, $after: String) {
    story(id: $id) {
      id
      ...storyMessages
    }
  }
  ${storyMessagesFragment}
`;
export const GET_STORY_MESSAGES_OPTIONS = {
  options: props => ({
    variables: { id: props.id },
  }),
  props: props => ({
    data: props.data,
    subscribeToNewMessages: () => {
      if (!props.data.story) {
        return;
      }
      return props.data.subscribeToMore({
        document: subscribeToNewMessages,
        variables: {
          thread: props.ownProps.id,
        },
        updateQuery: (prev, { subscriptionData }) => {
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
      });
    },
  }),
};

export const getStoryMessages = graphql(
  GET_STORY_MESSAGES_QUERY,
  GET_STORY_MESSAGES_OPTIONS
);
