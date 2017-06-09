import { graphql, gql } from 'react-apollo';

const META_INFORMATION_QUERY = gql`
  query {
    meta {
      userCount
      communityCount
      threadCount
      channelCount
      messageCount
      userGrowth {
        createdAt
      }
    }
  }
`;

export const overviewQuery = graphql(META_INFORMATION_QUERY);
