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
import { Button } from 'src/components/buttons';

type Props = {
  id: string,
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    community: GetCommunitySettingsType,
  },
  onSourceAvailable: Function,
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

    const defaultSource =
      community &&
      community.billingSettings &&
      community.billingSettings.sources &&
      community.billingSettings.sources.length > 0 &&
      community.billingSettings.sources.find(source => source.isDefault);

    if (isLoading) {
      return (
        <Well>
          <Loading size={16} />
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
}

export default compose(getCommunitySettings, viewNetworkHandler)(ModalWell);
