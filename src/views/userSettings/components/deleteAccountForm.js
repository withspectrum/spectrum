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
import { Loading } from 'src/components/loading';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';

type State = {
  isLoading: boolean,
  deleteInited: boolean,
  ownsCommunities: boolean,
};

type Props = {
  isLoading: boolean,
  deleteCurrentUser: Function,
  dispatch: Dispatch<Object>,
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

  initDelete = () => {
    track(events.USER_DELETED_INITED);
    this.setState({ deleteInited: true });
  };

  cancelDelete = () => this.setState({ deleteInited: false });

  confirmDelete = () => {
    this.setState({
      isLoading: true,
    });

    track(events.USER_DELETED);

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
    const { data: { user } } = this.props;

    if (user && user.isPro) {
      return (
        <SectionCard>
          <SectionTitle>Delete my account</SectionTitle>
          <SectionSubtitle>
            Please downgrade from the Pro plan before deleting your account.
          </SectionSubtitle>
        </SectionCard>
      );
    }

    if (user) {
      return (
        <SectionCard data-cy="delete-account-container">
          <SectionTitle>Delete my account</SectionTitle>
          <SectionSubtitle>
            You can delete your account at any time.{' '}
            <Link to={'/faq'}>Read more about how we delete accounts</Link>.
          </SectionSubtitle>

          {ownsCommunities && (
            <Notice data-cy="owns-communities-notice">
              You currently own communities on Spectrum. When your account is
              deleted these communities will not be deleted. Spectrum reserves
              the right to manage your communities after your account is
              deleted.
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
                {!isLoading && (
                  <OutlineButton
                    dataCy="delete-account-cancel-button"
                    onClick={this.cancelDelete}
                    style={{ marginBottom: '16px', alignSelf: 'stretch' }}
                  >
                    Cancel
                  </OutlineButton>
                )}
                <Button
                  dataCy="delete-account-confirm-button"
                  loading={isLoading}
                  disabled={isLoading}
                  gradientTheme={'warn'}
                  onClick={this.confirmDelete}
                >
                  Confirm and delete my account
                </Button>
              </div>
            ) : (
              <TextButton
                dataCy="delete-account-init-button"
                color={'warn.default'}
                onClick={this.initDelete}
              >
                Delete my account
              </TextButton>
            )}
          </SectionCardFooter>
        </SectionCard>
      );
    }

    if (this.props.isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  connect(),
  deleteCurrentUserMutation,
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(DeleteAccountForm);
