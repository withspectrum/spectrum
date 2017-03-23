import React from 'react';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import StripeCheckout from 'react-stripe-checkout';
import { closeModal } from '../../../actions/modals';
import { upgradeUser } from '../../../actions/user';
import { listenForUserUpgradeErrors } from '../../../db/users';
import { connect } from 'react-redux';
import { Button } from '../../Globals';
import {
  ButtonLabel,
  modalStyles,
  Section,
  SectionAlert,
  SectionError,
  Badge,
  Heading,
  Subheading,
  Flex,
  Padding,
  Spinner,
} from './style';

class UpgradeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      error: this.props.ui.upgradeError,
      loading: false,
    };
  }

  closeModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });

    this.props.dispatch(closeModal());
  };

  onToken = token => {
    this.props.dispatch(upgradeUser(token, 'beta-pro'));
  };

  render() {
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
          <SectionAlert width={'calc(100% - 2rem)'} centered={true}>
            <Badge>Limited Time</Badge>
            <Padding padding={'0.5rem 1rem'}>
              During beta, Pro subscriptions are just $5 per month ($10/mo after beta).
            </Padding>
          </SectionAlert>

          <Flex>
            <Section width={'33%'} centered={true}>
              <Padding padding={'1rem'}>
                <Heading>Save Stories</Heading>
                <Subheading>
                  Save any stories to a private collection, making it easier to find the things that matter most.
                </Subheading>
              </Padding>
            </Section>

            <Section width={'33%'} centered={true}>
              <Padding padding={'1rem'}>
                <Heading>Follow People</Heading>
                <Subheading>
                  Get updates whenever someone important to you posts a new public story.
                </Subheading>
              </Padding>
            </Section>

            <Section width={'33%'} centered={true}>
              <Padding padding={'1rem'}>
                <Heading>Show it Off</Heading>
                <Subheading>
                  A new{' '}
                  <em>Pro</em>
                  {' '}
                  badge will find itself attached to your name, wherever you go on Spectrum.
                </Subheading>
              </Padding>
            </Section>
          </Flex>

          <Section centered={true}>
            <Padding padding={'1rem'}>
              <StripeCheckout
                token={this.onToken}
                stripeKey="pk_test_A6pKi4xXOdgg9FrZJ84NW9mP"
                name="🔐   Pay Securely"
                description="Secured and Encrypted by Stripe"
                panelLabel="Subscribe for "
                amount={500}
                currency="USD"
              >

                <Button large loading={this.state.loading}>
                  <ButtonLabel loading={this.state.loading}>
                    {this.state.errorCount ? 'Try Again' : 'Upgrade to Pro'}
                  </ButtonLabel>
                  <Spinner size={'16'} loading={this.state.loading} />
                </Button>

              </StripeCheckout>
            </Padding>

            <SectionError
              width={'100%'}
              centered={true}
              error={this.state.error}
            >
              <Padding padding={'1rem'}>
                {this.state.error} Please try again.
              </Padding>
            </SectionError>
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
});

export default connect(mapStateToProps)(UpgradeModal);
