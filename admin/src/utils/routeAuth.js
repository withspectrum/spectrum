import * as React from 'react';
import { Route } from 'react-router';
import compose from 'recompose/compose';
import { isAdmin } from '../api/queries';

class Protect extends React.Component {
  state = { isAuthed: false };

  componentDidUpdate(prev) {
    const { data } = this.props;
    if (prev.data.loading && !data.loading && data.meta) {
      this.setState({
        isAuthed: data.meta.isAdmin,
      });
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    const { isAuthed } = this.state;

    if (isAuthed) {
      return <Route {...rest} render={props => <Component {...props} />} />;
    }

    return null;
  }
}

export default compose(isAdmin)(Protect);
