// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import getCommunitySettings, {
  type GetCommunitySettingsType,
} from 'shared/graphql/queries/community/getCommunitySettings';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import restoreChannel from 'shared/graphql/mutations/channel/restoreChannel';
import { getCardImage } from 'src/views/communityBilling/utils';
import StripeCardForm from 'src/components/stripeCardForm';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, Description } from '../styles';
import { Form, Actions, Well } from './style';

type Props = {
  dispatch: Function,
  isOpen: boolean,
  channel: GetChannelType,
  restoreChannel: Function,
  data: {
    community: GetCommunitySettingsType,
  },
};

type State = {
  isLoading: boolean,
};

class RestoreChannelModal extends React.Component<Props, State> {
  state = { isLoading: false };

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
    const { isOpen, channel, data } = this.props;
    const { isLoading } = this.state;

    const styles = modalStyles(420);

    const defaultSource =
      data.community &&
      data.community.billingSettings &&
      data.community.billingSettings.sources &&
      data.community.billingSettings.sources.length > 0 &&
      data.community.billingSettings.sources.find(source => source.isDefault);

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

            {data.community && (
              <React.Fragment>
                {channel.isPrivate &&
                  data.community.hasChargeableSource &&
                  defaultSource && (
                    <React.Fragment>
                      <Well>
                        <img
                          src={getCardImage(defaultSource.card.brand)}
                          width={32}
                        />
                        <span>
                          Pay with {defaultSource.card.brand} ending in{' '}
                          {defaultSource.card.last4}
                        </span>
                      </Well>
                    </React.Fragment>
                  )}

                {channel.isPrivate &&
                  !data.community.hasChargeableSource && (
                    <React.Fragment>
                      <Well column>
                        <p>
                          Add your payment information below to restore this
                          private channel. All payment information is secured
                          and encrypted by Stripe.
                        </p>
                        <StripeCardForm
                          community={data.community}
                          render={props => (
                            <Button
                              disabled={props.isLoading}
                              loading={props.isLoading}
                            >
                              Save Card
                            </Button>
                          )}
                        />
                      </Well>
                    </React.Fragment>
                  )}
              </React.Fragment>
            )}

            <Actions>
              <TextButton color={'warn.alt'}>Cancel</TextButton>
              <Button
                disabled={channel.isPrivate && !defaultSource}
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
  getCommunitySettings,
  restoreChannel
)(RestoreChannelModal);
