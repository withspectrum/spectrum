// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import joinChannelWithToken from 'shared/graphql/mutations/channel/joinChannelWithToken';
import { addToastWithTimeout } from 'src/actions/toasts';
import CommunityLogin from 'src/views/communityLogin';
import AppViewWrapper from 'src/components/appViewWrapper';
import { Loading } from 'src/components/loading';

type Props = {
  match: Object,
  location: Object,
  history: Object,
  joinChannelWithToken: Function,
  currentUser: Object,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class PrivateChannelJoin extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    const { match, history, currentUser } = this.props;
    const { token, communitySlug, channelSlug } = match.params;

    if (!token) {
      return history.push(`/${communitySlug}/${channelSlug}`);
    }

    if (!currentUser) {
      return;
    }

    return this.handleJoin();
  }

  componentDidUpdate(prevProps) {
    const curr = this.props;

    if (!prevProps.currentUser && curr.currentUser) {
      return this.handleJoin();
    }
  }

  handleJoin = () => {
    const { match, history, joinChannelWithToken, dispatch } = this.props;
    const { token, communitySlug, channelSlug } = match.params;

    this.setState({ isLoading: true });

    joinChannelWithToken({ channelSlug, token, communitySlug })
      .then(data => {
        console.log('mutation dat', data);
        this.setState({ isLoading: false });
        dispatch(addToastWithTimeout('success', 'Welcome!'));
        return history.push(`/${communitySlug}/${channelSlug}`);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        dispatch(addToastWithTimeout('error', err.message));
        return history.push(`/${communitySlug}/${channelSlug}`);
      });
  };

  render() {
    const { currentUser, match } = this.props;
    const { isLoading } = this.state;

    if (!currentUser || !currentUser.id) {
      return (
        <CommunityLogin
          match={match}
          redirectPath={`${window.location.href}`}
        />
      );
    }

    if (isLoading) {
      return (
        <AppViewWrapper>
          <Loading />
        </AppViewWrapper>
      );
    }

    return null;
  }
}

const map = state => ({ currentUser: state.users.currentUser });
// $FlowIssue
export default compose(connect(map), joinChannelWithToken)(PrivateChannelJoin);
