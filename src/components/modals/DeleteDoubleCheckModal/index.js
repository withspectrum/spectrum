// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
import ModalContainer from '../modalContainer';
import { LinkButton, Button } from '../../buttons';
import { modalStyles } from '../styles';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { deleteCommunityMutation } from '../../../api/community';
import { deleteFrequencyMutation } from '../../../api/frequency';
import { deleteStoryMutation } from '../../../api/story';
import { Actions, Message } from './style';

/*
  Generic component that should be used to confirm any 'delete' action.
  Takes modalProps as an object with four fields:

  entity => represents the table for lookup in the backend. Currently can
  be either 'story', 'frequency', or 'community'

  id => id of the entity to be deleted

  message => components can construct a custom confirmation message

  redirect => optional => string which represents the path a user should return
  too after deleting a thing (e.g. '/foo/bar')
*/
class DeleteDoubleCheckModal extends Component {
  close = () => {
    this.props.dispatch(closeModal());
  };

  triggerDelete = () => {
    const {
      modalProps: { id, entity, redirect },
      deleteCommunity,
      deleteStory,
      deleteFrequency,
      dispatch,
      history,
    } = this.props;

    switch (entity) {
      case 'story': {
        return deleteStory(id)
          .then(({ data: { deleteStory } }) => {
            if (deleteStory) {
              history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', 'Story deleted.'));
              this.close();
            }
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Something went wrong and we weren't able to delete this story. ${err}`
              )
            );
          });
      }
      case 'frequency': {
        return deleteFrequency(id)
          .then(({ data: { deleteFrequency } }) => {
            if (deleteFrequency) {
              history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', 'Frequency deleted.'));
              this.close();
            }
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Something went wrong and we weren't able to delete this frequency. ${err}`
              )
            );
          });
      }
      case 'community': {
        return deleteCommunity(id)
          .then(({ data: { deleteCommunity } }) => {
            if (deleteCommunity) {
              history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', 'Community deleted.'));
              this.close();
            }
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Something went wrong and we weren't able to delete this community. ${err}`
              )
            );
          });
      }
      default: {
        return dispatch(
          addToastWithTimeout(
            'error',
            'Unable to figure out what you wanted to delete. Whoops!'
          )
        );
      }
    }
  };

  render() {
    const { isOpen, modalProps: { message } } = this.props;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Are you sure?'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Are you sure?'} closeModal={this.close}>
          <Message>{message ? message : 'Are you sure?'}</Message>

          <Actions>
            <LinkButton onClick={this.close} color={'warn.alt'}>
              Cancel
            </LinkButton>
            <Button color="warn" onClick={this.triggerDelete}>Delete</Button>
          </Actions>
        </ModalContainer>
      </Modal>
    );
  }
}

const DeleteDoubleCheckModalWithMutations = compose(
  deleteCommunityMutation,
  deleteFrequencyMutation,
  deleteStoryMutation,
  withRouter
)(DeleteDoubleCheckModal);

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});
export default connect(mapStateToProps)(DeleteDoubleCheckModalWithMutations);
