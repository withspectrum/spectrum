import { graphql, gql } from 'react-apollo';

const META_INFORMATION_QUERY = gql`
  query {
    meta {
      userCount
      communityCount
      threadCount
      channelCount
      messageCount
    }
  }
`;

export const overviewQuery = graphql(META_INFORMATION_QUERY);
