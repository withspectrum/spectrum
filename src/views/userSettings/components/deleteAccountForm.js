// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { addToastWithTimeout } from 'src/actions/toasts';
import {
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { Notice } from 'src/components/listItems/style';
import {
  getCurrentUserCommunityConnection,
  type GetUserCommunityConnectionType,
} from 'shared/graphql/queries/user/getUserCommunityConnection';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { Button, TextButton, OutlineButton } from 'src/components/buttons';
import deleteCurrentUserMutation from 'shared/graphql/mutations/user/deleteCurrentUser';
import { SERVER_URL } from 'src/api/constants';
import Link from 'src/components/link';

type State = {
  isLoading: boolean,
  deleteInited: boolean,
  ownsCommunities: boolean,
};

type Props = {
  isLoading: boolean,
  deleteCurrentUser: Function,
  dispatch: Function,
  data: {
    user: GetUserCommunityConnectionType,
  },
};

class DeleteAccountForm extends React.Component<Props, State> {
  state = {
    isLoading: false,
    deleteInited: false,
    ownsCommunities: false,
  };

  componentDidUpdate(prevProps) {
    const curr = this.props;
    if (!prevProps.data.user && curr.data.user && curr.data.user.id) {
      if (curr.data.user && curr.data.user.communityConnection) {
        return this.setState({
          ownsCommunities: curr.data.user.communityConnection.edges.some(
            c => c && c.node.communityPermissions.isOwner
          ),
        });
      }
    }
  }

  initDelete = () => this.setState({ deleteInited: true });

  cancelDelete = () => this.setState({ deleteInited: false });

  confirmDelete = () => {
    this.setState({
      isLoading: true,
    });

    this.props
      .deleteCurrentUser()
      .then(() =>
        this.props.dispatch(addToastWithTimeout('success', 'Account deleted'))
      )
      .then(() => (window.location.href = `${SERVER_URL}/auth/logout`))
      .catch(err =>
        this.props.dispatch(addToastWithTimeout('error', err.message))
      );
  };

  render() {
    const { isLoading, ownsCommunities, deleteInited } = this.state;

    return (
      <SectionCard>
        <SectionTitle>Delete my account</SectionTitle>
        <SectionSubtitle>
          You can delete your account at any time.{' '}
          <Link to={'/faq'}>Read more about how we delete accounts</Link>.
        </SectionSubtitle>

        {ownsCommunities && (
          <Notice>
            You currently own communities on Spectrum. When your account is
            deleted these communities will not be deleted. After 30 days
            Spectrum reserves the right to manage your communities.
          </Notice>
        )}

        <SectionCardFooter>
          {deleteInited ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <OutlineButton
                onClick={this.cancelDelete}
                style={{ marginBottom: '16px', alignSelf: 'stretch' }}
              >
                Cancel
              </OutlineButton>
              <Button
                loading={isLoading}
                disabled={isLoading}
                gradientTheme={'warn'}
                onClick={this.confirmDelete}
              >
                Confirm and delete my account
              </Button>
            </div>
          ) : (
            <TextButton color={'warn.default'} onClick={this.initDelete}>
              Delete my account
            </TextButton>
          )}
        </SectionCardFooter>
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  deleteCurrentUserMutation,
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(DeleteAccountForm);
