import { graphql, gql } from 'react-apollo';

const META_INFORMATION_QUERY = gql`
  query {
    meta {
      userGrowth {
        createdAt
      }
      communityGrowth {
        createdAt
      }
      channelGrowth {
        createdAt
      }
      threadGrowth {
        createdAt
      }
      messageGrowth {
        createdAt
      }
    }
  }
`;

export const overviewQuery = graphql(META_INFORMATION_QUERY);
