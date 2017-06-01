// @flow
import React from 'react';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import {
  upgradeToProMutation,
  downgradeFromProMutation,
} from '../../../api/user';
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

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  upgradeToPro = token => {
    this.setState({
      isLoading: true,
    });

    const input = {
      plan: 'beta-pro',
      token: JSON.stringify(token),
    };

    this.props
      .upgradeToPro(input)
      .then(({ data: { upgradeToPro } }) => {
        this.props.dispatch(addToastWithTimeout('success', 'Upgraded to Pro!'));
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

  downgradeFromPro = () => {
    this.setState({
      isLoading: true,
    });

    this.props
      .downgradeFromPro()
      .then(({ data: { downgradeFromPro } }) => {
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
          {user.isPro &&
            <Section>
              <Subheading>
                We're sorry to see you go! If you are having trouble and want
                to talk to a human, please
                {' '}
                <a href="mailto:support@spectrum.chat">get in touch</a>
                . Otherwise if you're ready to go, you can
                cancel your Pro subscription instantly below. Thanks for your support!
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
                  onClick={() => window.location.href = '/spectrum/support'}
                >
                  Get Support
                </Button>
              </SectionActions>
              {upgradeError &&
                <SectionError
                  width={'100%'}
                  centered={true}
                  error={upgradeError}
                >
                  <Padding padding={'0.5rem'}>
                    {upgradeError}
                  </Padding>
                </SectionError>}
            </Section>}

          {!user.isPro && <UpsellUpgradeToPro />}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
});

export default compose(
  upgradeToProMutation,
  downgradeFromProMutation,
  connect(mapStateToProps)
)(UpgradeModal);
