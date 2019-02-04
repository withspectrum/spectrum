// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { closeModal } from '../../../actions/modals';
import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { Actions, Message } from './style';
import { modalStyles } from '../styles';

import type { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  modalProps: any,
};

class CloseComposerConfirmation extends React.Component<Props> {
  close = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    const {
      isOpen,
      modalProps: { message },
    } = this.props;

    const styles = modalStyles();

    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        <ModalContainer title={'Are you sure?'} closeModal={this.close}>
          <Message>
            {message ? message : 'Are you sure you want to dismiss composer?'}
          </Message>

          <Actions>
            <TextButton onClick={this.close} color={'warn.alt'}>
              No
            </TextButton>

            <Button color="warn" onClick={this.close}>
              Yes
            </Button>
          </Actions>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

export default connect(mapStateToProps)(CloseComposerConfirmation);
