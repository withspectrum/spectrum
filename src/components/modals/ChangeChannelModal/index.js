// @flow
import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { closeModal } from 'src/actions/modals';
import { connect } from 'react-redux';
import { TextButton, PrimaryOutlineButton } from 'src/components/button';
import moveThreadMutation from 'shared/graphql/mutations/thread/moveThread';
import type { MoveThreadType } from 'shared/graphql/mutations/thread/moveThread';
import { addToastWithTimeout } from 'src/actions/toasts';
import Icon from 'src/components/icon';
import { IconContainer } from '../RepExplainerModal/style';
import { Actions, modalStyles, Section, Title, Subtitle } from './style';
import ChannelSelector from './channelSelector';
import type { Dispatch } from 'redux';

type Props = {
  thread: any,
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  moveThread: Function,
};
type State = {
  activeChannel: string,
  isLoading: boolean,
};
class ChangeChannelModal extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      activeChannel: props.thread.channel.id,
      isLoading: false,
    };
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  setActiveChannel = e => this.setState({ activeChannel: e.target.value });

  saveNewChannel = () => {
    const { activeChannel } = this.state;
    const {
      thread: { id },
      dispatch,
    } = this.props;

    this.setState({
      isLoading: true,
    });

    return this.props
      .moveThread({ threadId: id, channelId: activeChannel })
      .then(({ data }: MoveThreadType) => {
        const { moveThread } = data;
        if (moveThread) {
          dispatch(
            addToastWithTimeout('success', 'Channel changed successfully.')
          );
          this.setState({
            isLoading: false,
          });
          this.closeModal();
        }
        return;
      })
      .catch(err => {
        dispatch(
          addToastWithTimeout(
            'error',
            `We weren't able to change channels. ${err.message}`
          )
        );
      });
  };

  render() {
    const { thread, isOpen } = this.props;
    const { activeChannel } = this.state;

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
          {thread.channel.isPrivate ? (
            <Section>
              <IconContainer>
                <Icon glyph={'private'} size={64} />
              </IconContainer>
              <Title>This thread can’t be moved</Title>
              <Subtitle>
                This thread was posted in the private channel{' '}
                {thread.channel.name} - threads in private channels cannot be
                moved.
              </Subtitle>
            </Section>
          ) : (
            <Section data-cy="move-thread-modal">
              <Title>Change channel</Title>
              <Subtitle>
                Move this thread to a new channel in the same community.
              </Subtitle>

              <ChannelSelector
                currentChannel={activeChannel}
                communitySlug={thread.community.slug}
                setActiveChannel={this.setActiveChannel}
                id={thread.community.id}
              />

              <Actions>
                <TextButton onClick={this.closeModal}>Cancel</TextButton>
                <PrimaryOutlineButton
                  loading={this.state.isLoading}
                  onClick={this.saveNewChannel}
                  disabled={activeChannel === thread.channel.id}
                >
                  {this.state.isLoading ? 'Saving...' : 'Save'}
                </PrimaryOutlineButton>
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
  connect(map),
  moveThreadMutation
)(ChangeChannelModal);
