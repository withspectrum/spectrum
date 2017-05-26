import React from 'react';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import StripeCheckout from 'react-stripe-checkout';
import { closeModal } from '../../../actions/modals';
import { upgradeUser } from '../../../actions/user';
import { connect } from 'react-redux';
import { Button } from '../../Globals';
import { stripeKey } from '../../../config/api';
import {
  ButtonLabel,
  modalStyles,
  Section,
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
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
    };
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  onToken = token => {
    this.props.dispatch(upgradeUser(token, 'beta-pro'));
  };

  render() {
    const { user, loading, ui: { upgradeError } } = this.props;

    return (
      <Modal
        isOpen={this.state.isOpen}
        contentLabel="Level Up"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >

        <ModalContainer title={'Level Up'} closeModal={this.closeModal}>
          <SectionAlert width={'100%'} centered={true}>
            <Padding padding={'0.5rem 1rem'}>
              The Beta Supporter Badge will only be available for a short period of time, grab it while you can!
            </Padding>
          </SectionAlert>

          <Flex direction={'column'}>
            <Section width={'100%'} centered={true}>
              <Padding padding={'1rem'}>
                <Profile>
                  <img alt={user.displayName} src={user.photoURL} />
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

          <Section width={'100%'} centered={true}>
            <StripeCheckout
              token={this.onToken}
              stripeKey={stripeKey}
              name="🔐   Pay Securely"
              description="Secured and Encrypted by Stripe"
              panelLabel="Subscribe for "
              amount={500}
              currency="USD"
            >

              <Button width={'100%'} disabled={loading.active}>
                <ButtonLabel loading={loading.active}>
                  Upgrade to Pro · $5 per Month
                </ButtonLabel>
                <Spinner color={'#fff'} size={'16'} loading={loading.active} />
              </Button>

            </StripeCheckout>

            {upgradeError &&
              <SectionError width={'100%'} centered={true} error={upgradeError}>
                <Padding padding={'0.5rem'}>
                  {upgradeError} Please try again.
                </Padding>
              </SectionError>}
          </Section>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  user: state.user,
  ui: state.ui,
  loading: state.loading,
});

export default connect(mapStateToProps)(UpgradeModal);
