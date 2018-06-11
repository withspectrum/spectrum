// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import {
  getUserById,
  getCurrentUser,
} from '../../../shared/graphql/queries/user/getUser';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import Profile from './profile';
import type { NavigationProps } from 'react-navigation';

type Props = {
  id: ?string,
  navigation: NavigationProps,
};

type State = {
  feed: 'participant' | 'creator',
};

const User = compose(getUserById, ViewNetworkHandler)(Profile);
const CurrentUser = compose(getCurrentUser, ViewNetworkHandler)(Profile);

class Container extends Component<Props, State> {
  render() {
    const { id, ...rest } = this.props;

    return id ? <User id={id} {...rest} /> : <CurrentUser {...rest} />;
  }
}

export default Container;
