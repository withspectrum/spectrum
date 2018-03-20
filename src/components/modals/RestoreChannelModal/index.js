// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import restoreChannel from 'shared/graphql/mutations/channel/restoreChannel';
import StripeCardWell from 'src/components/stripeCardForm/modalWell';
import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, Description } from '../styles';
import { Form, Actions } from './style';

type Props = {
  dispatch: Function,
  isOpen: boolean,
  channel: GetChannelType,
  id: string,
  restoreChannel: Function,
};

type State = {
  isLoading: boolean,
  hasChargeableSource: boolean,
};

class RestoreChannelModal extends React.Component<Props, State> {
  state = { isLoading: false, hasChargeableSource: false };

  onSourceAvailable = () => this.setState({ hasChargeableSource: true });

  close = () => {
    this.props.dispatch(closeModal());
  };

  restore = () => {
    const { channel, dispatch } = this.props;
    return this.props
      .restoreChannel({ channelId: channel.id })
      .then(() => {
        dispatch(addToastWithTimeout('success', 'Channel restored'));
        this.setState({
          isLoading: false,
        });
        return this.close();
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err.message));
        this.setState({
          isLoading: false,
        });
      });
  };

  render() {
    const { isOpen, channel } = this.props;
    const { isLoading, hasChargeableSource } = this.state;

    const styles = modalStyles(420);

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'Create a Channel'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Restore Channel'} closeModal={this.close}>
          <Form>
            <Description>
              Restoring a private channel will automatically resume your
              subscription at $10 per month.
            </Description>

            {channel.isPrivate && (
              <StripeCardWell
                id={this.props.id}
                onSourceAvailable={this.onSourceAvailable}
                closeModal={this.close}
              />
            )}

            <Actions>
              <TextButton color={'warn.alt'}>Cancel</TextButton>
              <Button
                disabled={channel.isPrivate && !hasChargeableSource}
                loading={isLoading}
                onClick={this.restore}
              >
                Restore Channel
              </Button>
            </Actions>
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
  restoreChannel
)(RestoreChannelModal);
