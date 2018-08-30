// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import createChannelMutation from 'shared/graphql/mutations/channel/createChannel';
import type { Dispatch } from 'redux';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, Notice } from '../styles';
import { Error, Checkbox } from '../../formElements';
import { Form, Actions } from './style';
import CommunityMembers from '../../../views/communityMembers/components/communityMembers';
import { StyledLabel } from '../../../../src/components/formElements/style';
import GranularUserProfile from '../../granularUserProfile';

type State = {
  loading: boolean,
  newOwner: Object,
};

type Props = {
  client: Object,
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  community: GetCommunityType,
  createChannel: Function,
};

class TransferOwnershipModal extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      loading: false,
      newOwner: null,
      transferError: false,
    };
  }

  close = () => {
    this.props.dispatch(closeModal());
  };

  create = e => {
    e.preventDefault();
    const { newOwner, transferError } = this.state;
    const { community } = this.props;

    // if an error is present, ensure the client cant submit the form
    if (transferError) {
      this.setState({
        transferError: true,
      });

      return;
    }

    // clientside checks have passed
    this.setState({
      transferError: false,
      loading: true,
    });

    // create the mutation input
    const input = {
      newOwner,
    };

    // TODO: actually transfer the ownership
    Promise.resolve()
      .then(() => {
        this.close();
        this.props.dispatch(
          addToastWithTimeout(
            'success',
            'The invitation to transfer the ownership has been sent!'
          )
        );
        return;
      })
      .catch(err => {
        this.setState({
          loading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.toString()));
      });
  };

  render() {
    const { isOpen, community } = this.props;

    const { transferError, loading, newOwner } = this.state;

    const styles = modalStyles(600);

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'Transfer Ownership'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Transfer Ownership'} closeModal={this.close}>
          <Form>
            <StyledLabel>
              Select a member of the community as the new owner:
            </StyledLabel>

            <CommunityMembers
              id={community.id}
              community={community}
              action={member => {
                return (
                  <Checkbox
                    checked={newOwner && member.id === newOwner.id}
                    onChange={() => {
                      this.setState({
                        newOwner: newOwner ? null : member,
                      });
                    }}
                  />
                );
              }}
            />

            {newOwner && (
              <div>
                <span>
                  Once the transfer is complete, the new owner will be:
                </span>
                <GranularUserProfile
                  userObject={newOwner && newOwner.user}
                  name={newOwner && newOwner.user.name}
                  username={newOwner && newOwner.user.username}
                  isCurrentUser={false}
                  onlineSize={'small'}
                  profilePhoto={newOwner && newOwner.user.profilePhoto}
                  avatarSize={40}
                  showHoverProfile={false}
                />
                <Notice>
                  <p style={{ fontWeight: 800 }}>
                    Final warning: this cannot be undone.
                  </p>
                  By submitting, an invitation to accept the ownership of the
                  community will be sent to {newOwner.user.name} (@{
                    newOwner.user.username
                  }).
                  <p>
                    You will remain the owner of this community until they
                    accept invitation.
                  </p>
                </Notice>
              </div>
            )}

            <Actions>
              <TextButton onClick={this.close} color={'warn.alt'}>
                Cancel
              </TextButton>
              <Button
                disabled={newOwner === null}
                loading={loading}
                onClick={this.create}
              >
                Transfer Ownership
              </Button>
            </Actions>

            {transferError && (
              <Error>
                Please fix any errors above before transferring the ownership of
                this community.
              </Error>
            )}
          </Form>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  isOpen: state.modals.isOpen,
});
export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  createChannelMutation,
  withRouter
)(TransferOwnershipModal);
