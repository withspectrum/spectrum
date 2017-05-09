// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import User from './user';
import Frequency from './frequency';
import Community from './community';

const SettingsPure = (props: Object): React$Element<any> => {
  const { type } = props;
  switch (type) {
    case 'user': {
      return <User {...props} />;
    }
    case 'frequency': {
      return <Frequency {...props} />;
    }
    case 'community': {
      return <Community {...props} />;
    }
    default: {
      return <User {...props} />;
    }
  }
};

type SettingsProps = {
  data: Object,
};

export const Settings = compose(pure)(SettingsPure);
export const UserSettings = (props: SettingsProps) => (
  <Settings type="user" {...props} />
);
export const FrequencySettings = (props: SettingsProps) => (
  <Settings type="frequency" {...props} />
);
export const CommunitySettings = (props: SettingsProps) => (
  <Settings type="community" {...props} />
);
