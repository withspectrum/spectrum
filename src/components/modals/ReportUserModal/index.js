// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { closeModal } from 'src/actions/modals';
import { addToastWithTimeout } from 'src/actions/toasts';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import reportUserMutation from 'shared/graphql/mutations/user/reportUser';
import type { Dispatch } from 'redux';
import ModalContainer from '../modalContainer';
import { TextButton, PrimaryOutlineButton } from 'src/components/button';
import { modalStyles } from '../styles';
import { TextArea, Error } from '../../formElements';
import { Form, Actions } from './style';
import { withCurrentUser } from 'src/components/withCurrentUser';

type State = {
  reason: ?string,
  reasonError: boolean,
  isLoading: boolean,
};

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  user: GetUserType,
  currentUser: Object,
  reportUser: Function,
};

class ReportUserModal extends React.Component<Props, State> {
  state = {
    reason: '',
    reasonError: false,
    isLoading: false,
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  changeReason = e => {
    const reason = e.target.value;

    this.setState({
      reason,
      reasonError: false,
    });
  };

  submit = e => {
    e.preventDefault();
    const { reason } = this.state;
    const { user, dispatch } = this.props;

    if (!reason || reason.length === 0) {
      return this.setState({ reasonError: false });
    }

    this.setState({
      isLoading: true,
    });

    // create the mutation input
    const input = {
      userId: user.id,
      reason,
    };

    this.props
      .reportUser(input)
      .then(() => {
        this.setState({ isLoading: false });
        this.close();
        return dispatch(
          addToastWithTimeout(
            'success',
            'Your report has been sent to the Spectrum team. Thank you!'
          )
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
        return dispatch(addToastWithTimeout('error', err.toString()));
      });
  };

  render() {
    const { isOpen, user } = this.props;
    const { reason, reasonError, isLoading } = this.state;

    const styles = modalStyles(420);

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={`Report ${user.name}`}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={`Report ${user.name}`} closeModal={this.close}>
          <Form>
            <TextArea
              id="slug"
              defaultValue={reason}
              onChange={this.changeReason}
              placeholder={'Add a reason for reporting this user...'}
            >
              Reason:
            </TextArea>

            {reasonError && (
              <Error>
                Please be sure to add a reason for reporting this user so the
                Spectrum team can take appropriate action.
              </Error>
            )}

            <Actions>
              <TextButton onClick={this.close}>Cancel</TextButton>
              <PrimaryOutlineButton
                disabled={!reason || reason.length === 0}
                loading={isLoading}
                onClick={this.submit}
              >
                {isLoading ? 'Sending...' : 'Send report'}
              </PrimaryOutlineButton>
            </Actions>
          </Form>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  isOpen: state.modals.isOpen,
});

export default compose(
  // $FlowIssue
  connect(map),
  withCurrentUser,
  reportUserMutation
)(ReportUserModal);
