// @flow
import compose from 'recompose/compose';
import { withRouter, type Location, type History } from 'react-router-dom';
import {
  getCurrentUser,
  type GetUserType,
} from 'shared/graphql/queries/user/getUser';

type Props = {
  data: {
    user: ?GetUserType,
  },
  location: Location,
  history: History,
};

const NoUsernameHandler = (props: Props) => {
  const { data, location, history } = props;
  const { user } = data;
  if (!user) return null;
  if (user && user.username) return null;
  const { pathname, search } = location;
  if (pathname === '/new/user') return null;
  history.replace({
    pathname: '/new/user',
    state: { redirect: `${pathname}${search}` },
  });
  return null;
};

export default compose(
  getCurrentUser,
  withRouter
)(NoUsernameHandler);
