// @flow
import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import Reputation from 'src/components/reputation';
import { UserAvatar } from 'src/components/avatar';
import Icon from 'src/components/icon';
import ModalContainer from '../modalContainer';
import { closeModal } from 'src/actions/modals';
import { connect } from 'react-redux';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  modalStyles,
  Section,
  Title,
  Subtitle,
  Rep,
  IconContainer,
  RepWrapper,
} from './style';

type Props = {
  dispatch: Function,
  isOpen: boolean,
  reputation: number,
  currentUser: ?Object,
};

class RepExplainerModal extends React.Component<Props> {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    const { currentUser, isOpen, reputation } = this.props;

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
          noHeader={true}
          title={null}
          closeModal={this.closeModal}
        >
          <Section>
            <IconContainer>
              <Icon glyph={'rep'} size={64} />
            </IconContainer>
            <Title>Spectrum Rep</Title>
            <Subtitle>
              Rep provides context about a person’s reputation in a community.
              Rep is earned by starting and joining productive conversations.
            </Subtitle>

            {reputation <= 0 ? (
              currentUser ? (
                <Rep>
                  You don’t have any rep yet. Earn rep by starting a
                  conversation or replying to other people in your communities.
                </Rep>
              ) : (
                ''
              )
            ) : currentUser ? (
              <Rep>
                <UserAvatar user={currentUser} size={24} />
                <RepWrapper>
                  <Reputation
                    reputation={currentUser.totalReputation}
                    ignoreClick
                  />
                </RepWrapper>
              </Rep>
            ) : (
              ''
            )}
          </Section>
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  isOpen: state.modals.isOpen,
});
export default compose(
  // $FlowFixMe
  connect(map),
  withCurrentUser
)(RepExplainerModal);
