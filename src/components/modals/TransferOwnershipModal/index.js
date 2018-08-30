// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import slugg from 'slugg';
import { CHANNEL_SLUG_BLACKLIST } from 'shared/slug-blacklists';
import { withApollo } from 'react-apollo';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { throttle } from '../../../helpers/utils';
import { getChannelBySlugAndCommunitySlugQuery } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import createChannelMutation from 'shared/graphql/mutations/channel/createChannel';
import StripeModalWell from 'src/components/stripeCardForm/modalWell';
import { track, events, transformations } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, Notice } from '../styles';
import { Input, TextArea, Error } from '../../formElements';
import { Form, Actions } from './style';

type State = {
  loading: boolean,
  newOwner: string,
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

    this.checkSlug = throttle(this.checkSlug, 500);
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
            'Community ownership has been transferred!'
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

    const styles = modalStyles(420);

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
            <Notice>
              Transferring the ownership of <strong>{community.name}</strong> is
              not reversible.
            </Notice>

            <Input
              id="newOwnerName"
              defaultValue={newOwner ? newOwner.username : null}
            >
              Enter the name of the new owner
            </Input>

            <Actions>
              <TextButton onClick={this.close} color={'warn.alt'}>
                Cancel
              </TextButton>
              <Button
                disabled={newOwner !== null}
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
