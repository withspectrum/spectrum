// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import StripeCardForm from './index';
import { getCardImage } from 'src/views/communityBilling/utils';
import { Well } from './style';
import getCommunitySettings, {
  type GetCommunitySettingsType,
} from 'shared/graphql/queries/community/getCommunitySettings';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import { Button, OutlineButton } from 'src/components/buttons';
import ViewError from 'src/components/viewError';
import Link from 'src/components/link';

type Props = {
  id: string,
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    community: GetCommunitySettingsType,
  },
  onSourceAvailable: Function,
  closeModal: Function,
};

class ModalWell extends React.Component<Props> {
  componentDidUpdate(prevProps) {
    const curr = this.props;

    if (prevProps.isLoading && !curr.isLoading) {
      if (curr.data.community.hasChargeableSource) {
        return curr.onSourceAvailable();
      }
    }

    if (
      prevProps.data &&
      prevProps.data.community &&
      (curr.data && curr.data.community) &&
      (!prevProps.data.community.hasChargeableSource &&
        curr.data.community.hasChargeableSource)
    ) {
      return curr.onSourceAvailable();
    }
  }

  render() {
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const defaultSource =
        community &&
        community.billingSettings &&
        community.billingSettings.sources &&
        community.billingSettings.sources.length > 0 &&
        community.billingSettings.sources.find(source => source.isDefault);

      const { administratorEmail } = community.billingSettings;

      if (!administratorEmail) {
        return (
          <Well column>
            <p>
              An administrator email is required before adding paid features to
              this community. Go to{' '}
              <Link to={`/${community.slug}/settings/billing`}>
                billing settings
              </Link>{' '}
              to enter an administrator email.
            </p>
            <Link to={`/${community.slug}/settings/billing`}>
              <OutlineButton
                style={{ marginTop: '12px', width: '100%' }}
                onClick={this.props.closeModal}
              >
                Add administrator email
              </OutlineButton>
            </Link>
          </Well>
        );
      }

      if (defaultSource) {
        return (
          <Well>
            <img
              alt={`${defaultSource.card.brand} ending in ${
                defaultSource.card.last4
              }`}
              src={getCardImage(defaultSource.card.brand)}
              width={32}
            />
            <span>
              Pay with {defaultSource.card.brand} ending in{' '}
              {defaultSource.card.last4}
            </span>
          </Well>
        );
      }

      return (
        <Well column>
          <p>
            Add your payment information below to create a private channel. All
            payment information is secured and encrypted by Stripe.
          </p>
          <StripeCardForm
            community={community}
            render={props => (
              <Button disabled={props.isLoading} loading={props.isLoading}>
                Save Card
              </Button>
            )}
          />
        </Well>
      );
    }

    if (isLoading) {
      return (
        <Well>
          <Loading size={16} />
        </Well>
      );
    }

    return (
      <ViewError
        heading={'We couldn’t fetch this community’s payment settings'}
        refresh
      />
    );
  }
}

export default compose(getCommunitySettings, viewNetworkHandler)(ModalWell);
