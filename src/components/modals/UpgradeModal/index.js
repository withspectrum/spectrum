import React from 'react';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { track } from '../../../helpers/events';
import { downgradeFromProMutation } from '../../../api/user';
import { addToastWithTimeout } from '../../../actions/toasts';
// $FlowFixMe
import { connect } from 'react-redux';
import { Button, OutlineButton } from '../../buttons';
import { UpsellUpgradeToPro } from '../../upsell';
import {
  modalStyles,
  Section,
  SectionActions,
  SectionError,
  Subheading,
  Padding,
} from './style';

class UpgradeModal extends React.Component {
  state: {
    isOpen: boolean,
    upgradeError: string,
    isLoading: boolean,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen,
      upgradeError: '',
      isLoading: false,
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user.isPro) {
      track('pro', 'downgrade inited', null);
    } else {
      track('pro', 'upgrade inited', null);
    }
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  downgradeFromPro = () => {
    this.setState({
      isLoading: true,
    });

    this.props
      .downgradeFromPro()
      .then(({ data: { downgradeFromPro } }) => {
        track('pro', 'downgraded', null);

        this.props.dispatch(
          addToastWithTimeout(
            'neutral',
            'Your subscription has been cancelled - sorry to see you go!'
          )
        );
        this.setState({
          isLoading: false,
          upgradeError: '',
        });
        this.closeModal();
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          upgradeError: err.message,
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { user } = this.props;
    const { upgradeError, isOpen, isLoading } = this.state;

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={
          !user.isPro ? 'Upgrade to Pro' : 'Manage your Subscription'
        }
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={!user.isPro}
          title={!user.isPro ? 'Upgrade to Pro' : 'Manage your Subscription'}
          closeModal={this.closeModal}
        >
          {user.isPro && (
            <Section>
              <Subheading>
                We're sorry to see you go! If you are having trouble and want to
                talk to a human, please{' '}
                <a href="mailto:support@spectrum.chat">get in touch</a>
                . Otherwise if you're ready to go, you can cancel your Pro
                subscription instantly below. Thanks for your support!
              </Subheading>

              <SectionActions centered={true}>
                <OutlineButton
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={this.downgradeFromPro}
                >
                  Cancel my Pro Subscription
                </OutlineButton>

                <Button
                  onClick={() => (window.location.href = '/spectrum/support')}
                >
                  Get Support
                </Button>
              </SectionActions>
              {upgradeError && (
                <SectionError
                  width={'100%'}
                  centered={true}
                  error={upgradeError}
                >
                  <Padding padding={'0.5rem'}>{upgradeError}</Padding>
                </SectionError>
              )}
            </Section>
          )}

          {!user.isPro && <UpsellUpgradeToPro complete={this.closeModal} />}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default compose(downgradeFromProMutation, connect(mapStateToProps))(
  UpgradeModal
);
