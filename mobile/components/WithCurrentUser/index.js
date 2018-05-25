// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

type Props = {
  render: Function,
  data: {
    user?: GetUserType,
  },
};

class WithCurrentUser extends React.Component<Props> {
  render() {
    return this.props.render({ currentUser: this.props.data.user });
  }
}

export default compose(getCurrentUser)(WithCurrentUser);
