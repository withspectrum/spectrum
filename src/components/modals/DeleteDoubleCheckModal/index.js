// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import deleteCommunityMutation from 'shared/graphql/mutations/community/deleteCommunity';
import type { DeleteCommunityType } from 'shared/graphql/mutations/community/deleteCommunity';
import deleteChannelMutation from 'shared/graphql/mutations/channel/deleteChannel';
import type { DeleteChannelType } from 'shared/graphql/mutations/channel/deleteChannel';
import deleteThreadMutation from 'shared/graphql/mutations/thread/deleteThread';
import type { DeleteThreadType } from 'shared/graphql/mutations/thread/deleteThread';
import deleteMessage from 'shared/graphql/mutations/message/deleteMessage';
import type { DeleteMessageType } from 'shared/graphql/mutations/message/deleteMessage';
import archiveChannel from 'shared/graphql/mutations/channel/archiveChannel';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles } from '../styles';
import { Actions, Message } from './style';
import cancelSubscription from 'shared/graphql/mutations/community/cancelSubscription';
import disableCommunityAnalytics from 'shared/graphql/mutations/community/disableCommunityAnalytics';

/*
  Generic component that should be used to confirm any 'delete' action.
  Takes modalProps as an object with four fields:

  entity => represents the table for lookup in the backend. Currently can
  be either 'thread', 'channel', or 'community'

  id => id of the entity to be deleted

  message => components can construct a custom confirmation message

  redirect => optional => string which represents the path a user should return
  too after deleting a thing (e.g. '/foo/bar')
*/
type State = {
  isLoading: boolean,
};

type Props = {
  dispatch: Function,
  modalProps: {
    id: string,
    entity: string,
    redirect?: ?string,
    message?: ?string,
    buttonLabel?: string,
    extraProps?: Object,
  },
  deleteMessage: Function,
  deleteCommunity: Function,
  deleteThread: Function,
  deleteChannel: Function,
  cancelSubscription: Function,
  disableCommunityAnalytics: Function,
  archiveChannel: Function,
  dispatch: Function,
  isOpen: boolean,
};

class DeleteDoubleCheckModal extends React.Component<Props, State> {
  state = {
    isLoading: false,
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  triggerDelete = () => {
    const { modalProps: { id, entity, redirect }, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    switch (entity) {
      case 'message':
        return this.props
          .deleteMessage(id)
          .then(({ data }: DeleteMessageType) => {
            const { deleteMessage } = data;
            if (deleteMessage) {
              dispatch(addToastWithTimeout('neutral', 'Message deleted.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Sorry, we weren't able to delete this message. ${err.message}`
              )
            );
          });
      case 'thread': {
        return this.props
          .deleteThread(id)
          .then(({ data }: DeleteThreadType) => {
            const { deleteThread } = data;
            if (deleteThread) {
              // TODO: When we figure out the mutation reducers in apollo
              // client we can just history push and trust the store to update
              // eslint-disable-next-line
              window.location.href = redirect ? redirect : '/';
              // history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', 'Thread deleted.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Sorry, we weren't able to delete this thread. ${err.message}`
              )
            );
          });
      }
      case 'channel': {
        return this.props
          .deleteChannel(id)
          .then(({ data }: DeleteChannelType) => {
            const { deleteChannel } = data;
            if (deleteChannel) {
              // TODO: When we figure out the mutation reducers in apollo
              // client we can just history push and trust the store to update
              // eslint-disable-next-line
              window.location.href = redirect ? redirect : '/';
              // history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', 'Channel deleted.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Sorry, we weren't able to delete this channel. ${err.message}`
              )
            );
          });
      }
      case 'community': {
        return this.props
          .deleteCommunity(id)
          .then(({ data }: DeleteCommunityType) => {
            const { deleteCommunity } = data;
            if (deleteCommunity) {
              // TODO: When we figure out the mutation reducers in apollo
              // client we can just history push and trust the store to update
              // eslint-disable-next-line
              window.location.href = redirect ? redirect : '/';
              // history.push(redirect ? redirect : '/');
              dispatch(addToastWithTimeout('neutral', 'Community deleted.'));
              this.setState({
                isLoading: false,
              });
              this.close();
            }
            return;
          })
          .catch(err => {
            dispatch(
              addToastWithTimeout(
                'error',
                `Sorry, we weren't able to delete this community. ${
                  err.message
                }`
              )
            );
            this.setState({
              isLoading: false,
            });
          });
      }
      case 'community-subscription': {
        return this.props
          .cancelSubscription({ communityId: id })
          .then(() => {
            dispatch(addToastWithTimeout('neutral', 'Subscription canceled'));
            this.setState({
              isLoading: false,
            });
            return this.close();
          })
          .catch(err => {
            dispatch(addToastWithTimeout('error', err.message));
            this.setState({
              isLoading: false,
            });
          });
      }
      case 'community-analytics': {
        return this.props
          .disableCommunityAnalytics({ communityId: id })
          .then(() => {
            dispatch(addToastWithTimeout('neutral', 'Analytics removed'));
            this.setState({
              isLoading: false,
            });
            return this.close();
          })
          .catch(err => {
            dispatch(addToastWithTimeout('error', err.message));
            this.setState({
              isLoading: false,
            });
          });
      }
      case 'channel-archive': {
        return this.props
          .archiveChannel({ channelId: id })
          .then(() => {
            dispatch(addToastWithTimeout('neutral', 'Channel archived'));
            this.setState({
              isLoading: false,
            });
            return this.close();
          })
          .catch(err => {
            dispatch(addToastWithTimeout('error', err.message));
            this.setState({
              isLoading: false,
            });
          });
      }
      default: {
        this.setState({
          isLoading: false,
        });

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
    const { isOpen, modalProps: { message, buttonLabel } } = this.props;
    const styles = modalStyles();

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
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
            <TextButton onClick={this.close} color={'warn.alt'}>
              Cancel
            </TextButton>
            <Button
              loading={this.state.isLoading}
              color="warn"
              onClick={this.triggerDelete}
              dataCy={'delete-button'}
            >
              {buttonLabel || 'Delete'}
            </Button>
          </Actions>
        </ModalContainer>
      </Modal>
    );
  }
}

const DeleteDoubleCheckModalWithMutations = compose(
  deleteCommunityMutation,
  deleteChannelMutation,
  deleteThreadMutation,
  disableCommunityAnalytics,
  deleteMessage,
  cancelSubscription,
  archiveChannel,
  withRouter
)(DeleteDoubleCheckModal);

const map = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

// $FlowIssue
export default connect(map)(DeleteDoubleCheckModalWithMutations);
