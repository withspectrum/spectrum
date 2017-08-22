import { gql } from 'react-apollo';

export const userSettingsFragment = gql`
  fragment userSettings on User {
    settings {
      notifications {
        types {
          newMessageInThreads {
            email
          }
          newThreadCreated {
            email
          }
          newDirectMessage {
            email
          }
        }
      }
    }
  }
`;
