// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import User from './user';
import Channel from './channel';

const EditFormPure = (props: Object): React$Element<any> => {
  const { type } = props;
  switch (type) {
    default:
    case 'user': {
      return <User {...props} />;
    }
    case 'channel': {
      return <Channel {...props} />;
    }
  }
};

type FormProps = {
  data?: Object,
};

export const EditForm = compose()(EditFormPure);
export const UserEditForm = (props: FormProps) => (
  <EditForm type="user" {...props} />
);
export const ChannelEditForm = (props: FormProps) => (
  <EditForm type="channel" {...props} />
);
