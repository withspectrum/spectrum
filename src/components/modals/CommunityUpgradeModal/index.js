// @flow
import * as React from 'react';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { closeModal } from '../../../actions/modals';
import { track } from '../../../helpers/events';
import downgradeCommunityMutation from 'shared/graphql/mutations/community/downgradeCommunity';
import type { DowngradeCommunityType } from 'shared/graphql/mutations/community/downgradeCommunity';
import { addToastWithTimeout } from '../../../actions/toasts';
import { connect } from 'react-redux';
import { Button, OutlineButton } from '../../buttons';
import { UpsellUpgradeCommunity } from '../../../views/communitySettings/components/upgradeCommunity';
import {
  modalStyles,
  Section,
  SectionActions,
  SectionError,
  Subheading,
  Padding,
} from './style';

type State = {
  isOpen: boolean,
  upgradeError: string,
  isLoading: boolean,
};

type Props = {
  isOpen: boolean,
  user: {
    isPro: boolean,
  },
  community: {
    id: string,
  },
  dispatch: Function,
  downgradeCommunity: Function,
};

class CommunityUpgradeModal extends React.Component<Props, State> {
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
      track('community pro', 'downgrade inited', null);
    } else {
      track('community pro', 'upgrade inited', null);
    }
  }

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  downgradeFromPro = () => {
    this.setState({
      isLoading: true,
    });

    const input = {
      id: this.props.community.id,
    };

    this.props
      .downgradeCommunity(input)
      .then(({ data }: DowngradeCommunityType) => {
        track('community pro', 'downgraded', null);

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

        return;
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
    const { user, community } = this.props;
    const { upgradeError, isOpen, isLoading } = this.state;

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
        isOpen={isOpen}
        contentLabel={
          !community.isPro
            ? 'Upgrade your community'
            : 'Manage your subscription'
        }
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          noHeader={!user.isPro}
          title={null}
          closeModal={this.closeModal}
        >
          {community.isPro && (
            <Section>
              <Subheading>
                We're sorry to see you go! If you are having trouble and want to
                talk to a human, please{' '}
                <a href="mailto:support@spectrum.chat">get in touch</a>
                . Otherwise if you're ready to go, you can cancel your
                community's Pro subscription instantly below. Thanks for your
                support!
              </Subheading>

              <Subheading>
                Any private channels you've created will be locked. Any
                conversations in your private channels will still be accessible,
                but creating new threads and messages will be disabled.
              </Subheading>

              <SectionActions centered={true}>
                <OutlineButton
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={this.downgradeFromPro}
                >
                  Downgrade my community
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

          {!community.isPro && (
            <div style={{ padding: '16px' }}>
              <UpsellUpgradeCommunity
                community={community}
                complete={this.closeModal}
              />
            </div>
          )}
        </ModalContainer>
      </Modal>
    );
  }
}

const map = state => ({
  isOpen: state.modals.isOpen,
});

export default compose(
  downgradeCommunityMutation,
  // $FlowIssue
  connect(map)
)(CommunityUpgradeModal);
