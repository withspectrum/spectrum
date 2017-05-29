// @flow
import React from 'react';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
// $FlowFixMe
import StripeCheckout from 'react-stripe-checkout';
import { closeModal } from '../../../actions/modals';
import {
  upgradeToProMutation,
  downgradeFromProMutation,
} from '../../../api/user';
import { addToastWithTimeout } from '../../../actions/toasts';
// $FlowFixMe
import { connect } from 'react-redux';
import { Button } from '../../buttons';
import {
  modalStyles,
  Section,
  SectionActions,
  SectionAlert,
  SectionError,
  Heading,
  Subheading,
  Flex,
  Padding,
  Spinner,
  Profile,
} from './style';

class UpgradeModal extends React.Component {
  state: {
    isOpen: boolean,
    upgradeError: string,
    isLoading: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      upgradeError: '',
      isLoading: false,
    };
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  upgradeToPro = token => {
    this.setState({
      isLoading: true,
    });

    const input = {
      plan: 'beta-pro',
      token: JSON.stringify(token),
    };

    this.props
      .upgradeToPro(input)
      .then(({ data: { upgradeToPro } }) => {
        this.props.dispatch(addToastWithTimeout('success', 'Upgraded to Pro!'));
        this.setState({
          isLoading: false,
          upgradeError: '',
        });
        this.closeModal();
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          upgradeError: err.message,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  downgradeFromPro = () => {
    this.setState({
      isLoading: true,
    });

    this.props
      .downgradeFromPro()
      .then(({ data: { downgradeFromPro } }) => {
        this.props.dispatch(
          addToastWithTimeout(
            'neutral',
            'Your subscription has been cancelled - sorry to see you go!'
          )
        );
        this.setState({
          isLoading: false,
          upgradeError: '',
        });
        this.closeModal();
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          upgradeError: err.message,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { user, loading } = this.props;
    const { upgradeError, isOpen, isLoading } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={
          !user.isPro ? 'Upgrade to Pro' : 'Manage your Subscription'
        }
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >

        <ModalContainer
          title={!user.isPro ? 'Upgrade to Pro' : 'Manage your Subscription'}
          closeModal={this.closeModal}
        >
          {user.isPro &&
            <SectionActions centered={true}>
              <Button
                disabled={isLoading}
                loading={isLoading}
                onClick={this.downgradeFromPro}
              >
                Cancel my Pro Subscription
              </Button>

              {upgradeError &&
                <SectionError
                  width={'100%'}
                  centered={true}
                  error={upgradeError}
                >
                  <Padding padding={'0.5rem'}>
                    {upgradeError}
                  </Padding>
                </SectionError>}
            </SectionActions>}

          {!user.isPro &&
            <div>
              <Flex direction={'column'}>
                <Section width={'100%'} centered={true}>
                  <Padding padding={'1rem'}>
                    <Profile>
                      <img alt={user.name} src={user.profilePhoto} />
                      <span>PRO</span>
                    </Profile>
                    <Heading>Show it Off</Heading>
                    <Subheading>
                      A new{' '}
                      <b>Pro</b>
                      {' '}
                      badge will find itself attached to your name, wherever you go on Spectrum.
                    </Subheading>
                  </Padding>
                </Section>

                <Section width={'100%'} centered={true}>
                  <Padding padding={'1rem 1rem 2rem'}>
                    <Heading>More Pro Features...</Heading>
                    <Subheading>
                      We're hard at work building more pro features, and your support helps us get there. Thank you!
                    </Subheading>
                  </Padding>
                </Section>
              </Flex>
              <SectionActions centered={true}>
                <StripeCheckout
                  token={this.upgradeToPro}
                  stripeKey={'pk_test_A6pKi4xXOdgg9FrZJ84NW9mP'}
                  name="🔐   Pay Securely"
                  description="Secured and Encrypted by Stripe"
                  panelLabel="Subscribe for "
                  amount={500}
                  currency="USD"
                >
                  <Button disabled={isLoading} loading={isLoading}>
                    Upgrade to Pro · $5 per Month
                  </Button>
                </StripeCheckout>
                {upgradeError &&
                  <SectionError
                    width={'100%'}
                    centered={true}
                    error={upgradeError}
                  >
                    <Padding padding={'0.5rem'}>
                      {upgradeError}
                    </Padding>
                  </SectionError>}
              </SectionActions>
            </div>}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default compose(
  upgradeToProMutation,
  downgradeFromProMutation,
  connect(mapStateToProps)
)(UpgradeModal);
