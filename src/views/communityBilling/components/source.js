// @flow
import * as React from 'react';
import {
  SourceContainer,
  SourceContentContainer,
  SourceText,
  SourceName,
  SourceExpiration,
} from '../style';
import Badge from '../../../components/badges';
import EditSource from './editSourceDropdown';
import type { GetCommunityBillingSettingsType } from 'shared/graphql/queries/community/getCommunityBillingSettings';

type Props = {
  community: GetCommunityBillingSettingsType,
  isLastSource: boolean,
  source: {
    id: string,
    card: {
      brand: string,
      last4: string,
      exp_month: number,
      exp_year: number,
    },
  },
};

const getCardImage = (brand: string) => {
  switch (brand) {
    case 'Visa':
      return '/img/payment-methods/visa.svg';
    case 'Discover':
      return '/img/payment-methods/discover.svg';
    case 'Diners Club':
      return '/img/payment-methods/diners-club.svg';
    case 'MasterCard':
      return '/img/payment-methods/mastercard.svg';
    case 'American Express':
      return '/img/payment-methods/amex.svg';
    case 'JCB':
      return '/img/payment-methods/jcb.svg';
    default:
      return '/img/payment-methods/card-unknown.svg';
  }
};

class Source extends React.Component<Props> {
  render() {
    const { source, community, isLastSource } = this.props;
    const imageSrc = getCardImage(source.card.brand);
    return (
      <SourceContainer>
        <SourceContentContainer>
          <img src={imageSrc} alt={'Payment method icon'} width={48} />
          <SourceText>
            <SourceName>
              {source.card.brand} ending in {source.card.last4}
              {source.isDefault && <Badge type={'default-payment-method'} />}
            </SourceName>
            <SourceExpiration>
              Expires {source.card.exp_month}/{source.card.exp_year}
            </SourceExpiration>
          </SourceText>
        </SourceContentContainer>
        <div>
          <EditSource
            isLastSource={isLastSource}
            community={community}
            source={source}
          />
        </div>
      </SourceContainer>
    );
  }
}

export default Source;
