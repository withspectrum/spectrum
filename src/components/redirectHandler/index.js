// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { history } from 'src/helpers/history';
import queryString from 'query-string';
import Routes from 'src/hot-routes';

type Props = {
  currentUser: ?Object,
  isLoadingCurrentUser: boolean,
  maintenanceMode: boolean,
};

class RedirectHandler extends React.Component<Props> {
  componentDidUpdate(prev: Props) {
    const curr = this.props;
    const params = queryString.parse(history.location.search);
    const doneFetching =
      prev.isLoadingCurrentUser && !curr.isLoadingCurrentUser;

    if (doneFetching) {
      // Redirect ?t=asdfxyz to the thread view only for anonymous users who wouldn't see it
      // in their inbox view (since they don't have an inbox view)
      if (!curr.currentUser && params.t) {
        history.replace(`/thread/${params.t}`);
      }
    }
  }

  render() {
    return <Routes maintenanceMode={this.props.maintenanceMode} />;
  }
}

export default compose(withCurrentUser)(RedirectHandler);
