// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import User from './user';
import Frequency from './frequency';
import Community from './community';

const EditFormPure = (props: Object): React$Element<any> => {
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

type FormProps = {
  data: Object,
};

export const EditForm = compose(pure)(EditFormPure);
export const UserEditForm = (props: FormProps) => (
  <EditForm type="user" {...props} />
);
export const FrequencyEditForm = (props: FormProps) => (
  <EditForm type="frequency" {...props} />
);
export const CommunityEditForm = (props: FormProps) => (
  <EditForm type="community" {...props} />
);
