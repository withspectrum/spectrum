// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from '../../components/link';
import getCommunityBillingSettings, {
  type GetCommunityBillingSettingsType,
} from 'shared/graphql/queries/community/getCommunityBillingSettings';
import ViewError from '../../components/viewError';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import {
  SectionsContainer,
  SectionCard,
  SectionTitle,
  SectionSubtitle,
  Column,
} from '../../components/settingsViews/style';
import { AddCardSection } from './style';
import StripeCardForm from '../../components/stripeCardForm';
import AdministratorEmailForm from './components/administratorEmailForm';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from '../../components/viewNetworkHandler';
import { Loading } from '../../components/loading';
import Source from './components/source';

type Props = {
  ...$Exact<ViewNetworkHandlerType>,
  currentUser: Object,
  data: {
    community: GetCommunityBillingSettingsType,
  },
  dispatch: Function,
  match: Object,
  history: Object,
};

class CommunityMembersSettings extends React.Component<Props> {
  render() {
    const { data, isLoading } = this.props;
    const { community } = data;
    console.log('billing community ', community);

    if (community && community.id && community.communityPermissions.isOwner) {
      if (!community.billingSettings.administratorEmail) {
        return (
          <SectionsContainer>
            <Column>
              <AdministratorEmailForm community={community} id={community.id} />
            </Column>
          </SectionsContainer>
        );
      }

      return (
        <SectionsContainer>
          <Column>
            <SectionCard>
              <SectionTitle>Active subscriptions</SectionTitle>
              {community.billingSettings.subscriptions.length === 0 && (
                <React.Fragment>
                  <SectionSubtitle>
                    You have no active subscriptions. As soon as you add
                    moderators, private channels, analytics, or priority support
                    to this community, your subscription information will appear
                    here.
                  </SectionSubtitle>
                  <SectionSubtitle>
                    <Link to={'/pricing'}>
                      Learn more about Spectrum features
                    </Link>
                  </SectionSubtitle>
                </React.Fragment>
              )}
              {community.billingSettings.subscriptions.map(
                subscription =>
                  subscription && <p key={subscription.id}>{subscription.id}</p>
              )}
            </SectionCard>
          </Column>

          <Column>
            <SectionCard>
              <SectionTitle>Payment methods</SectionTitle>
              <SectionSubtitle>
                You can manage your payment information here or change your
                default card. If you remove all payment methods, any active
                subscriptions will be canceled immediately.
              </SectionSubtitle>
              {community.billingSettings.sources.map(
                (source, index, array) =>
                  source && (
                    <Source
                      isLastSource={array.length === 1}
                      key={source.id}
                      source={source}
                      community={community}
                    />
                  )
              )}
              <AddCardSection>
                <SectionTitle>Add new card</SectionTitle>
                <StripeCardForm
                  community={community}
                  render={({ isLoading }) => (
                    <Button loading={isLoading}>Save</Button>
                  )}
                />
              </AddCardSection>
            </SectionCard>

            <SectionCard>
              <SectionTitle>Payment history</SectionTitle>
              {community.billingSettings.invoices.length === 0 && (
                <SectionSubtitle>
                  Receipts will appear here each time a payment occurs.
                </SectionSubtitle>
              )}
              {community.billingSettings.invoices.map(
                invoice => invoice && <p key={invoice.id}>{invoice.id}</p>
              )}
            </SectionCard>
          </Column>
        </SectionsContainer>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <ViewError
        heading={'You don’t have permission to manage this community.'}
        subheading={
          'If you want to create your own community, you can get started below.'
        }
      >
        <ButtonRow>
          <Link to={'/'}>
            <OutlineButton large>Take me back</OutlineButton>
          </Link>

          <Link to={'/new/community'}>
            <Button large>Create a community</Button>
          </Link>
        </ButtonRow>
      </ViewError>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map),
  getCommunityBillingSettings,
  viewNetworkHandler
)(CommunityMembersSettings);
