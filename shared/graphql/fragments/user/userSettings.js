// @flow
import gql from 'graphql-tag';

export type UserSettingsType = {
  settings: {},
};

export default gql`
  fragment userSettings on User {
    settings {
    }
  }
`;
