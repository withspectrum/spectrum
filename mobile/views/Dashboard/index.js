// @flow
import * as React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';
import getCurrentUserEverythingFeed from '../../../shared/graphql/queries/user/getCurrentUserEverythingFeed';
import { setCurrentUserId } from '../../actions/currentUserId';
import type { State as ReduxState } from '../../reducers';
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

import { Wrapper } from './style';

const EverythingThreadFeed = compose(getCurrentUserEverythingFeed)(ThreadFeed);

type Props = {
  navigation: Object,
  dispatch: Function,
  data: {
    user?: GetUserType,
  },
  currentUserId: ?GetUserType,
};

class Dashboard extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (!prevProps.data.user && curr.data.user) {
      if (!curr.currentUserId || curr.data.user.id !== curr.currentUserId) {
        return curr.dispatch(setCurrentUserId(curr.data.user.id));
      }
    }
  }
  render() {
    return (
      <Wrapper>
        <View testID="welcome" style={{ flex: 1 }}>
          <EverythingThreadFeed />
        </View>
      </Wrapper>
    );
  }
}

const map = ({ currentUserId }: ReduxState): * => ({ currentUserId });
export default compose(connect(map), withSafeView, getCurrentUser)(Dashboard);
