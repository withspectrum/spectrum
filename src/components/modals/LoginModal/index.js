// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
import { SERVER_URL } from '../../../api';
import { track } from '../../../helpers/events';
import { closeModal } from '../../../actions/modals';
import ModalContainer from '../modalContainer';
import { Button } from '../../buttons';
import { modalStyles } from '../styles';
import { SignInButtons, Description } from './style';

class LoginModal extends Component {
  close = () => {
    this.props.dispatch(closeModal());
  };

  login = method => {
    // log the user in and return them to this page
    return (window.location.href = `${SERVER_URL}/auth/${method}?r=${window.location.href}`);
  };

  render() {
    const { isOpen, modalProps } = this.props;
    const styles = modalStyles(300);

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Sign up or log in'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        <ModalContainer title={'Sign up or log in'} closeModal={this.close}>
          <Description>
            Sign up or log in below to join the conversation
          </Description>
          <SignInButtons>
            <Button
              gradientTheme={'none'}
              hoverColor={'social.twitter.default'}
              color={'social.twitter.default'}
              onClick={() => this.login('twitter')}
              icon="twitter"
              label
            >
              Sign in with Twitter
            </Button>
            <Button
              gradientTheme={'none'}
              hoverColor={'social.facebook.default'}
              color={'social.facebook.default'}
              onClick={() => this.login('facebook')}
              icon="facebook"
              label
            >
              Sign in with Facebook
            </Button>
            <Button
              gradientTheme={'none'}
              hoverColor={'social.google.default'}
              color={'social.google.default'}
              onClick={() => this.login('google')}
              icon="google"
              label
            >
              Sign in with Google
            </Button>
          </SignInButtons>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

export default connect(mapStateToProps)(LoginModal);
