// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import joinChannelWithToken from 'shared/graphql/mutations/channel/joinChannelWithToken';
import { addToastWithTimeout } from 'src/actions/toasts';
import CommunityLogin from 'src/views/communityLogin';
import { CLIENT_URL } from 'src/api/constants';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { LoadingView, ErrorView } from 'src/views/viewHelpers';

type Props = {
  match: Object,
  location: Object,
  history: Object,
  joinChannelWithToken: Function,
  currentUser: Object,
  dispatch: Dispatch<Object>,
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
      .then(() => {
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

    const {
      params: { communitySlug, channelSlug, token },
    } = match;

    const redirectPath = `${CLIENT_URL}/${communitySlug}/${channelSlug}/join/${token}`;

    if (!currentUser || !currentUser.id) {
      return <CommunityLogin match={match} redirectPath={redirectPath} />;
    }

    if (isLoading) return <LoadingView />;

    return <ErrorView />;
  }
}

export default compose(
  withCurrentUser,
  joinChannelWithToken,
  connect()
)(PrivateChannelJoin);
