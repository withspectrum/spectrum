// @flow
import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { connect } from 'react-redux';
import { TextButton, Button } from '../../buttons';
import { addToastWithTimeout } from '../../../actions/toasts';
import Icon from '../../icons';
import { IconContainer } from '../RepExplainerModal/style';
import { Section, Title, Subtitle, Actions, modalStyles } from './style';
import type { Dispatch } from 'redux';

type Props = {
  thread: any,
  dispatch: Dispatch<Object>,
  isOpen: boolean,
};
class EditThreadTagsModal extends React.Component<Props> {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  saveTags = () => {
    this.closeModal();
  };

  render() {
    const { thread, isOpen } = this.props;

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'Reputation'}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={false}
          title={null}
          closeModal={this.closeModal}
        >
          <Section data-cy="edit-thread-tags-modal">
            <Title>Edit Thread Tags</Title>
            <Subtitle>Edit the tags of this thread</Subtitle>

            <Actions>
              <TextButton onClick={this.closeModal} color={'warn.alt'}>
                Cancel
              </TextButton>
              <Button color="warn" onClick={this.saveTags}>
                Save
              </Button>
            </Actions>
          </Section>
          )}
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({ isOpen: state.modals.isOpen });
export default compose(
  // $FlowIssue
  connect(map)
)(EditThreadTagsModal);
