// @flow
import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from 'src/actions/toasts';
import { connect } from 'react-redux';
import { modalStyles } from '../styles';
import { Loading } from 'src/components/loading';
import { Section, Title, Subtitle } from './style';
import { Button } from 'src/components/buttons';
import StripeCardForm from 'src/components/stripeCardForm';
import enableCommunityAnalytics from 'shared/graphql/mutations/community/enableCommunityAnalytics';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import PoweredByStripe from '../components/poweredByStripe';

type Props = {
  dispatch: Function,
  isOpen: boolean,
  currentUser: Object,
  community: GetCommunitySettingsType,
  enableCommunityAnalytics: Function,
};

type State = {
  isLoading: boolean,
};

class RepExplainerModal extends React.Component<Props, State> {
  state = { isLoading: false };

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  onCardSaved = () => {
    this.setState({ isLoading: true });
    const input = {
      communityId: this.props.community.id,
    };
    return this.props
      .enableCommunityAnalytics(input)
      .then(() => {
        this.setState({ isLoading: false });
        this.closeModal();
        return this.props.dispatch(
          addToastWithTimeout('success', 'Analytics unlocked!')
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isOpen, community } = this.props;
    const { isLoading } = this.state;

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={'Reputation'}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles(420)}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={true}
          title={null}
          closeModal={this.closeModal}
        >
          <Section>
            <Title>{isLoading ? 'Unlocking analytics...' : 'Add a card'}</Title>

            {isLoading && (
              <Section>
                <Loading />
              </Section>
            )}

            {!isLoading && (
              <React.Fragment>
                <Subtitle>
                  To add community analytics to this community, please add a
                  payment method.
                </Subtitle>

                <StripeCardForm
                  onCardSaved={this.onCardSaved}
                  community={community}
                  render={formProps => (
                    <Button loading={formProps.isLoading}>Save</Button>
                  )}
                />
              </React.Fragment>
            )}
          </Section>

          <PoweredByStripe />
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
  isOpen: state.modals.isOpen,
});
export default compose(
  // $FlowIssue
  connect(map),
  enableCommunityAnalytics
)(RepExplainerModal);
