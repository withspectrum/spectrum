// @flow
import gql from 'graphql-tag';
import threadInfoFragment from '../fragments/thread/threadInfo';

export const subscribeToUpdatedThreads = gql`
  subscription subscribeToUpdatedThreads {
    threadUpdated {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;
