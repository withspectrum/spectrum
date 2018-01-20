// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import StripeCheckout from 'react-stripe-checkout';
import { PUBLIC_STRIPE_KEY } from '../../../api/constants';
import { upgradeCommunityMutation } from '../../../api/community';
import { addToastWithTimeout } from '../../../actions/toasts';
import { openModal } from '../../../actions/modals';
import { NullCard } from '../../../components/upsell';
import { Button, OutlineButton } from '../../../components/buttons';
import {
  PlanTitle,
  PlanDescription,
  Plan,
  PlanCost,
  Highlight,
  PlanEmoji,
  PlanActions,
} from '../style';
import {
  SectionTitle,
  SectionSubtitle,
} from '../../../components/settingsViews/style';

type State = {
  upgradeError: string,
  isLoadingProject: boolean,
  isLoadingBusiness: boolean,
};

type Props = {
  upgradeCommunity: Function,
  dispatch: Function,
  complete?: Function,
  community: {
    id: string,
    name: string,
    metaData: {
      members: number,
    },
  },
};

class UpsellUpgradeCommunityPure extends React.Component<Props, State> {
  state = {
    upgradeError: '',
    isLoadingProject: false,
    isLoadingBusiness: false,
  };

  upgrade = (token: string, plan: string) => {
    this.setState({
      isLoadingProject: plan === 'community-project',
      isLoadingBusiness: plan === 'community-business',
    });

    const input = {
      plan,
      token: JSON.stringify(token),
      communityId: this.props.community.id,
    };

    this.props
      .upgradeCommunity(input)
      .then(({ data: { upgradeCommunity }, data }) => {
        this.props.dispatch(
          addToastWithTimeout('success', 'Community upgraded!')
        );
        this.setState({
          isLoadingProject: false,
          isLoadingBusiness: false,
          upgradeError: '',
        });

        // if the upgrade is triggered from a modal, close the modal
        this.props.complete && this.props.complete();
      })
      .catch(err => {
        this.setState({
          isLoadingProject: false,
          isLoadingBusiness: false,
          upgradeError: err.message,
        });

        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { isLoadingProject, isLoadingBusiness } = this.state;
    const { community } = this.props;

    return (
      <div>
        <SectionTitle>Supercharge your community</SectionTitle>
        <SectionSubtitle>
          All community plans come with{' '}
          <Highlight>unlimited messages, threads, and members</Highlight>.
          Upgrade below to access tools that will help you to better manage,
          grow, and understand your community.
        </SectionSubtitle>

        <Plan>
          <PlanTitle>
            <PlanEmoji>🔧</PlanEmoji> Project <PlanCost>$15/mo</PlanCost>
          </PlanTitle>
          <PlanDescription>
            Adds <Highlight>one additional moderator seat</Highlight>, unlocks{' '}
            <Highlight>private channels</Highlight>.
          </PlanDescription>
          <PlanActions>
            <StripeCheckout
              token={token => this.upgrade(token, 'community-project')}
              stripeKey={PUBLIC_STRIPE_KEY}
              name="🔐   Pay Securely"
              description="Secured and Encrypted by Stripe"
              panelLabel="Subscribe for "
              amount={1500}
              currency="USD"
            >
              <OutlineButton
                disabled={isLoadingProject}
                loading={isLoadingProject}
              >
                Upgrade to Project Plan
              </OutlineButton>
            </StripeCheckout>
          </PlanActions>
        </Plan>

        <Plan>
          <PlanTitle>
            <PlanEmoji>🛠</PlanEmoji> Business{' '}
            <PlanCost>$100/mo, per 1,000 members</PlanCost>
          </PlanTitle>
          <PlanDescription>
            Adds <Highlight>three additional moderator seats</Highlight>,
            unlocks <Highlight>private channels</Highlight>, access to
            <Highlight> community analytics</Highlight>, and{' '}
            <Highlight>priority support</Highlight> from the Spectrum team.
          </PlanDescription>
          <PlanDescription>
            Note: this plan scales with your community. For every additional
            1,000 members in your community, the price of the plan will increase
            by $100. Your current rate will be{' '}
            <Highlight>
              ${Math.ceil(community.metaData.members / 1000) * 100} per month
            </Highlight>.
          </PlanDescription>

          <PlanActions>
            <StripeCheckout
              token={token => this.upgrade(token, 'community-standard')}
              stripeKey={PUBLIC_STRIPE_KEY}
              name="🔐   Pay Securely"
              description="Secured and Encrypted by Stripe"
              panelLabel="Subscribe for "
              amount={Math.ceil(community.metaData.members / 1000) * 10000}
              currency="USD"
            >
              <OutlineButton
                disabled={isLoadingBusiness}
                loading={isLoadingBusiness}
              >
                Upgrade to Business Plan
              </OutlineButton>
            </StripeCheckout>
          </PlanActions>
        </Plan>
      </div>
    );
  }
}

export const UpsellUpgradeCommunity = compose(
  upgradeCommunityMutation,
  connect()
)(UpsellUpgradeCommunityPure);

type UpgradeProps = {
  currentUser: Object,
  community: {
    name: string,
    id: string,
    communityPermissions: {
      isOwner: boolean,
    },
  },
  dispatch: Function,
};

class UpsellUpgradeCommunityPrivateChannelPure extends React.Component<
  UpgradeProps
> {
  openCommunityUpgradeModal = () => {
    const { currentUser, community } = this.props;

    this.props.dispatch(
      openModal('COMMUNITY_UPGRADE_MODAL', { user: currentUser, community })
    );
  };

  render() {
    const { community } = this.props;

    const str = community.communityPermissions.isOwner
      ? `Private channels are only available to communities on the Project or Business plans. Upgrade your community to re-activate this channel.`
      : `Private channels are only available to communities on the Project or Business plans. The owner of the ${
          community.name
        } community can upgrade it from the community settings page.`;

    return (
      <NullCard heading="This channel has been closed." copy={str}>
        {community.communityPermissions.isOwner && (
          <Button onClick={this.openCommunityUpgradeModal}>
            Upgrade {community.name}
          </Button>
        )}
      </NullCard>
    );
  }
}

const mapUpgrade = state => ({ currentUser: state.users.currentUser });
export const UpsellUpgradeCommunityPrivateChannel = compose(
  // $FlowIssue
  connect(mapUpgrade)
)(UpsellUpgradeCommunityPrivateChannelPure);
