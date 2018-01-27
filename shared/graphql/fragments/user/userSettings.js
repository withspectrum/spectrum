// @flow
import gql from 'graphql-tag';

export type UserSettingsType = {
  settings: {
    notifications: {
      types: {
        newMessageInThreads: {
          email: boolean,
        },
        newDirectMessage: {
          email: boolean,
        },
        newThreadCreated: {
          email: boolean,
        },
        weeklyDigest: {
          email: boolean,
        },
        dailyDigest: {
          email: boolean,
        },
        newMention: {
          email: boolean,
        },
      },
    },
  },
};

export default gql`
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
