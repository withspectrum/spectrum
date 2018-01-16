// @flow
import React from 'react';
import compose from 'recompose/compose';
import User from './user';

const EditFormPure = (props: Object): React$Element<any> => {
  const { type } = props;
  switch (type) {
    default:
    case 'user': {
      return <User {...props} />;
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
