// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import {
  getUserById,
  getCurrentUser,
} from '../../../shared/graphql/queries/user/getUser';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import Profile from './profile';

type Props = {
  id: ?string,
};

type State = {
  feed: 'participant' | 'creator',
};

const User = compose(getUserById, ViewNetworkHandler)(Profile);
const CurrentUser = compose(getCurrentUser, ViewNetworkHandler)(Profile);

class Container extends React.Component<Props, State> {
  render() {
    const { id, ...rest } = this.props;

    return id ? <User id={id} {...rest} /> : <CurrentUser {...rest} />;
  }
}

export default Container;
