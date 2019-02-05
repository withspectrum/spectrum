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
  state = {
    isLoading: false,
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  closeConfirmed = functionsArray => {
    // functionArgs contains some of the action you want to execute when
    // confirmation is accepted (yes clicked)
    for (const func of functionsArray) {
      func();
    }

    this.close();
  };

  render() {
    const {
      isOpen,
      modalProps: { message, ...callbacks },
    } = this.props;

    const functions = Object.keys(callbacks).map(k => callbacks[k]);

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
        <ModalContainer title={'Dismiss Composer'} closeModal={this.close}>
          <Message>
            {message ? message : 'Are you sure you want to dismiss composer?'}
          </Message>

          <Actions>
            <TextButton onClick={this.close} color={'warn.alt'}>
              No
            </TextButton>

            <Button color="warn" onClick={() => this.closeConfirmed(functions)}>
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
