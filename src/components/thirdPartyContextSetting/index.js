// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { getCurrentUser } from 'shared/graphql/queries/user/getUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import { setTrackingContexts } from 'src/actions/authentication';

type Props = {
  data: { user: GetUserType },
};

class AuthViewHandler extends React.Component<Props> {
  componentDidUpdate(prev: Props) {
    const {
      data: { user },
    } = this.props;

    if (!prev.data.user && user) {
      setTrackingContexts(user);
    }
  }

  render() {
    return null;
  }
}

export default compose(getCurrentUser)(AuthViewHandler);
