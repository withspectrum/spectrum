import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { closeModal, openModal } from '../../../actions/modals';
import { downgradeUser } from '../../../actions/user';
import { modalStyles } from '../FrequencyEditModal/style';
import { Heading, Subheading, Or, Relative } from './style';
import { ButtonLabel, Spinner, Section } from '../UpgradeModal/style';
import { Button, TextButton } from '../../Globals';

class EditAccountModal extends React.Component {
  state = {
    canceled: false,
  };

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  downgrade = e => {
    const subscriptionId = e.target.id;

    this.props.dispatch(downgradeUser(subscriptionId));
  };

  openUpgradeModal = () => {
    this.props.dispatch(openModal('UPGRADE_MODAL', this.props.user));
  };

  emailSupport = () => {
    location.href = '~support';
  };

  render() {
    const { user, loading } = this.props;

    let userSubscriptions, subscriptionIds;
    if (user.subscriptions) {
      userSubscriptions = user.subscriptions;
      subscriptionIds = Object.keys(user.subscriptions);
    }

    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel="My Account"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer title={`My Account`} closeModal={this.closeModal}>

          <Heading>My Subscriptions</Heading>

          {userSubscriptions
            ? subscriptionIds.map(id => {
                const name = userSubscriptions[id].name;
                const amount = userSubscriptions[id].amount / 100;
                return (
                  <Section width={'100%'} key={id}>
                    <Subheading>{name} · ${amount} per month</Subheading>

                    <Button onClick={this.emailSupport} width={'100%'}>
                      Questions? Get Support
                    </Button>

                    <Or><span>or</span></Or>

                    <Relative>
                      <TextButton
                        width={'100%'}
                        disabled={loading.active}
                        id={id}
                        onClick={this.downgrade}
                      >
                        <ButtonLabel loading={loading.active}>
                          Cancel {name}
                        </ButtonLabel>
                        <Spinner
                          color={'#747E8D'}
                          size={'16'}
                          loading={loading.active}
                        />
                      </TextButton>
                    </Relative>
                  </Section>
                );
              })
            : <Section width={'100%'}>
                <Subheading success>
                  Your subscription has been successfully canceled.
                </Subheading>
                <Button onClick={this.closeModal} width={'100%'}>
                  Back to Spectrum
                </Button>
                <Or><span>or</span></Or>
                <TextButton width={'100%'} onClick={this.openUpgradeModal}>
                  Learn more about Pro
                </TextButton>
              </Section>}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.loading,
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(EditAccountModal);
