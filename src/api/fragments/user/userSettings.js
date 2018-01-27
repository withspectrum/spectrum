import gql from 'graphql-tag';

export const userSettingsFragment = gql`
  fragment userSettings on User {
    settings {
      notifications {
        types {
          newMessageInThreads {
            email
          }
          newDirectMessage {
            email
          }
          newThreadCreated {
            email
          }
          weeklyDigest {
            email
          }
          dailyDigest {
            email
          }
          newMention {
            email
          }
        }
      }
    }
  }
`;
