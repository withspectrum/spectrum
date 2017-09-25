import { gql } from 'react-apollo';

export const userEverythingFragment = gql`
  fragment userEverything on User {
    everything(first: 10, after: $after) {
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
