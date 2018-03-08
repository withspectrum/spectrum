// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { closeModal } from '../../../actions/modals';
import ModalContainer from '../modalContainer';
import { modalStyles } from '../styles';
import LoginButtonSet from 'src/components/loginButtonSet';
import { Container } from './style';

type Props = {
  dispatch: Function,
  isOpen: boolean,
  modalProps: any,
};

class ChatInputLoginModal extends React.Component<Props> {
  close = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    const { isOpen } = this.props;

    const styles = modalStyles();
    const redirectPath = `${window.location.href}`;
    const signinType = 'signin';

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'Log in or sign up'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Log in or sign up'} closeModal={this.close}>
          <Container>
            <LoginButtonSet
              redirectPath={redirectPath}
              signinType={signinType}
            />
          </Container>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

export default compose(connect(map))(ChatInputLoginModal);
