import { gql } from 'react-apollo';

export const communityThreadsFragment = gql`
  fragment communityThreads on Community {
    threadConnection(first: 10, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          id
          messageCount
          lastActive
          creator {
            id
            name
            username
            profilePhoto
          }
          channel {
            id
            name
            slug
            isPrivate
            community {
              id
              name
              slug
              profilePhoto
            }
          }
          community {
            id
            name
            slug
          }
          isPublished
          isLocked
          isCreator
          type
          participants {
            id
            name
            username
            profilePhoto
          }
          content {
            title
            body
          }
          attachments {
            attachmentType
            data
          }
        }
      }
    }
  }
`;
