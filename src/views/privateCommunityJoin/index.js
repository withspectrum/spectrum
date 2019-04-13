// @flow
//
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import addCommunityMemberWithTokenMutation from 'shared/graphql/mutations/communityMember/addCommunityMemberWithToken';
import { addToastWithTimeout } from 'src/actions/toasts';
import CommunityLogin from 'src/views/communityLogin';
import { CLIENT_URL } from 'src/api/constants';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';

type Props = {
  match: Object,
  location: Object,
  history: Object,
  addCommunityMemberWithToken: Function,
  currentUser: Object,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class PrivateCommunityJoin extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    const { match, history, currentUser } = this.props;
    const { token, communitySlug } = match.params;

    if (!token) {
      return history.replace(`/${communitySlug}`);
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
    const {
      match,
      history,
      addCommunityMemberWithToken,
      dispatch,
    } = this.props;
    const { token, communitySlug } = match.params;

    this.setState({ isLoading: true });

    addCommunityMemberWithToken({ communitySlug, token })
      .then(() => {
        this.setState({ isLoading: false });
        dispatch(addToastWithTimeout('success', 'Welcome!'));
        return history.replace(`/${communitySlug}`);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        dispatch(addToastWithTimeout('error', err.message));
        return history.replace(`/${communitySlug}`);
      });
  };

  render() {
    const { currentUser, match } = this.props;
    const { isLoading } = this.state;

    const {
      params: { communitySlug, token },
    } = match;

    const redirectPath = `${CLIENT_URL}/${communitySlug}/join/${token}`;

    if (!currentUser || !currentUser.id) {
      return <CommunityLogin match={match} redirectPath={redirectPath} />;
    }

    if (isLoading) return <LoadingView />;

    return <ErrorView />;
  }
}

export default compose(
  withCurrentUser,
  addCommunityMemberWithTokenMutation,
  connect()
)(PrivateCommunityJoin);
