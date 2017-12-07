import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import Reputation from '../../reputation';
import Avatar from '../../avatar';
import Icon from '../../icons';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { connect } from 'react-redux';
import {
  modalStyles,
  Section,
  Title,
  Subtitle,
  Rep,
  IconContainer,
  RepWrapper,
} from './style';

type Props = {};
class RepExplainerModal extends React.Component<Props> {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    const { currentUser, isOpen, reputation } = this.props;

    return (
      <Modal
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
              Rep provides context about a person's reputation in a community.
              Rep is earned by starting and joining productive conversations.
            </Subtitle>

            {reputation <= 0 ? (
              currentUser ? (
                <Rep>
                  You don't have any rep yet. Earn rep by starting a
                  conversation or replying to other people in your communities.
                </Rep>
              ) : (
                ''
              )
            ) : currentUser ? (
              <Rep>
                <Avatar
                  src={currentUser.profilePhoto}
                  user={currentUser}
                  size={24}
                />
                <RepWrapper>
                  <Reputation
                    tipText={'Your total reputation'}
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
  currentUser: state.users.currentUser,
  isOpen: state.modals.isOpen,
});
export default compose(connect(map))(RepExplainerModal);
