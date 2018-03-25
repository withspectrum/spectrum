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
import { getCardImage } from '../utils';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';

type Props = {
  community: GetCommunitySettingsType,
  canRemoveDefault: boolean,
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

class Source extends React.Component<Props> {
  render() {
    const { source, community, canRemoveDefault } = this.props;
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
        <React.Fragment>
          {!source.isDefault && (
            <EditSource community={community} source={source} />
          )}
          {source.isDefault &&
            canRemoveDefault && (
              <EditSource community={community} source={source} />
            )}
        </React.Fragment>
      </SourceContainer>
    );
  }
}

export default Source;
