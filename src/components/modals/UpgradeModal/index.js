// @flow
import React from 'react';
import Modal from 'react-modal';
import ModalContainer from '../modalContainer';
// $FlowFixMe
import StripeCheckout from 'react-stripe-checkout';
import { closeModal } from '../../../actions/modals';
// $FlowFixMe
import { connect } from 'react-redux';
import { Button } from '../../buttons';
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
    // this.props.dispatch(upgradeUser(token, 'beta-pro'));
  };

  render() {
    const { user, loading } = this.props;

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
          yo
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(UpgradeModal);
