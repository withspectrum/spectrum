import { graphql, gql } from 'react-apollo';
import { subscribeToNewMessages } from './subscriptions';

export const getStory = graphql(
  gql`
  query story($id: ID!) {
    story(id: $id) {
      id
      locked
      content {
        title
        description
      }
      author {
        displayName
        username
        photoURL
      }
      frequency {
        id
        name
      }
      messageConnection(first: 100) {
        edges {
          node {
            id
            message {
              type
              content
            }
          }
        }
      }
    }
  }
`,
  {
    options: props => ({
      variables: { id: props.match.params.storyId },
    }),
    props: props => {
      return {
        data: props.data,
        subscribeToNewMessages: () => {
          return props.data.subscribeToMore({
            document: subscribeToNewMessages,
            variables: {
              thread: props.ownProps.match.params.storyId,
            },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev;
              }

              const newMessage = subscriptionData.data.messageAdded;

              const newData = {
                ...prev,
                story: {
                  ...prev.story,
                  messageConnection: {
                    ...prev.story.messageConnection,
                    edges: [
                      ...prev.story.messageConnection.edges,
                      { node: newMessage },
                    ],
                  },
                },
              };

              console.log('\n\n');
              console.log('Prev');
              console.log(prev);
              console.log('newData');
              console.log(newData);
              console.log('\n\n');

              return newData;
            },
          });
        },
      };
    },
  }
);
