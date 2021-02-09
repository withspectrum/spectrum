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
import {
  HoverWarnOutlineButton,
  WarnButton,
  OutlineButton,
} from 'src/components/button';
import deleteCurrentUserMutation from 'shared/graphql/mutations/user/deleteCurrentUser';
import { SERVER_URL } from 'src/api/constants';
import { Link } from 'react-router-dom';
import { Loading } from 'src/components/loading';
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
    this.setState({ deleteInited: true });
  };

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
    const {
      data: { user },
    } = this.props;

    if (user) {
      return (
        <SectionCard data-cy="delete-account-container">
          <SectionTitle>Delete my account</SectionTitle>
          <SectionSubtitle>
            You can delete your account at any time.{' '}
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
                    data-cy="delete-account-cancel-button"
                    onClick={this.cancelDelete}
                    style={{ marginBottom: '16px', alignSelf: 'stretch' }}
                  >
                    Cancel
                  </OutlineButton>
                )}
                <WarnButton
                  data-cy="delete-account-confirm-button"
                  loading={isLoading}
                  onClick={this.confirmDelete}
                >
                  {isLoading ? 'Deleting...' : 'Confirm and delete my account'}
                </WarnButton>
              </div>
            ) : (
              <HoverWarnOutlineButton
                data-cy="delete-account-init-button"
                color={'warn.default'}
                onClick={this.initDelete}
              >
                Delete my account
              </HoverWarnOutlineButton>
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
