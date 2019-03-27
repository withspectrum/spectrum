// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { closeModal } from '../../../actions/modals';
import ModalContainer from '../modalContainer';
import { TextButton, WarnButton } from '../../button';
import { Actions, Message } from './style';
import { modalStyles } from '../styles';
import { ENTER } from '../../../helpers/keycodes';

import type { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  modalProps: any,
};

type State = {
  isLoading: boolean,
};

class CloseComposerConfirmation extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    // $FlowIssue
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    // $FlowIssue
    document.removeEventListener('keydown', this.handleKeyPress, false);
    return this.close();
  }

  handleKeyPress = e => {
    const enter = e.keyCode === ENTER;

    const {
      modalProps: { message, ...callbacks },
    } = this.props;

    const functions = Object.keys(callbacks).map(k => callbacks[k]);

    if (enter) {
      this.closeConfirmed(functions);
    }
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
        <ModalContainer
          dataCy="discard-draft-modal"
          title={'Discard Draft'}
          closeModal={this.close}
        >
          <Message>
            {message ? message : 'Are you sure you want to discard this draft?'}
          </Message>

          <Actions>
            <TextButton
              color={'text.placeholder'}
              hoverColor={'warn.default'}
              onClick={this.close}
              data-cy={'discard-draft-cancel'}
            >
              Cancel
            </TextButton>

            <WarnButton
              gradientTheme={'warn'}
              color={'warn.default'}
              hoverColor={'warn.default'}
              data-cy={'discard-draft-discard'}
              onClick={() => this.closeConfirmed(functions)}
            >
              Discard
            </WarnButton>
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

// $FlowIssue
export default connect(mapStateToProps)(CloseComposerConfirmation);
