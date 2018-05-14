// @flow
import gql from 'graphql-tag';

export type UserSettingsType = {
  settings: {
    notifications: {
      types: {
        newMessageInThreads: {
          email: boolean,
          web: boolean,
        },
        newDirectMessage: {
          email: boolean,
          web: boolean,
        },
        newThreadCreated: {
          email: boolean,
          web: boolean,
        },
        weeklyDigest: {
          email: boolean,
          web: boolean,
        },
        dailyDigest: {
          email: boolean,
          web: boolean,
        },
        newMention: {
          email: boolean,
          web: boolean,
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
            web
          }
          newDirectMessage {
            email
            web
          }
          newThreadCreated {
            email
            web
          }
          weeklyDigest {
            email
            web
          }
          dailyDigest {
            email
            web
          }
          newMention {
            email
            web
          }
        }
      }
    }
  }
`;
