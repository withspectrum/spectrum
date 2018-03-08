// @flow
import * as React from 'react';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import enableCommunityAnalytics from 'shared/graphql/mutations/community/enableCommunityAnalytics';
import { addToastWithTimeout } from 'src/actions/toasts';
import { openModal } from 'src/actions/modals';
import { getCardImage } from 'src/views/communityBilling/utils';
import {
  Container,
  Content,
  Subtitle,
  Title,
  Description,
  ActionRow,
  CardInfo,
} from './style';
import Link from 'src/components/link';
import { Button, TextButton } from 'src/components/buttons';

type Props = {
  community: GetCommunitySettingsType,
  enableCommunityAnalytics: Function,
  dispatch: Function,
};

type State = {
  isLoading: boolean,
};

class AnalyticsUpsell extends React.Component<Props, State> {
  state = { isLoading: false };

  initEnableCommunityAnalytics = () => {
    this.setState({ isLoading: true });
    const input = {
      communityId: this.props.community.id,
    };
    return this.props
      .enableCommunityAnalytics(input)
      .then(() => {
        this.setState({ isLoading: false });
        return this.props.dispatch(
          addToastWithTimeout('success', 'Analytics unlocked!')
        );
      })
      .catch(err => {
        this.setState({ isLoading: false });
        return this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  initAddPaymentMethod = () => {
    return this.props.dispatch(
      openModal('UPGRADE_ANALYTICS_MODAL', { community: this.props.community })
    );
  };

  getDefaultCardInfo = () => {
    const { community } = this.props;
    const sources = community.billingSettings.sources;
    if (!sources || sources.length === 0) return null;
    const defaultSource = sources.find(source => source.isDefault);
    if (!defaultSource) return null;
    return (
      <CardInfo>
        <img src={getCardImage(defaultSource.card.brand)} width={32} />
        <span>
          Paying with {defaultSource.card.brand} ending in{' '}
          {defaultSource.card.last4}
        </span>
      </CardInfo>
    );
  };

  render() {
    const { isLoading } = this.state;
    const action = this.props.community.hasChargeableSource
      ? this.initEnableCommunityAnalytics
      : this.initAddPaymentMethod;

    return (
      <Container>
        <Content>
          <Subtitle>Supercharge your community</Subtitle>
          <Title>Community Analytics</Title>
          <Description>
            Unlock deeper insights into the content and people who make up your
            community. With analytics you‘ll have a real-time understanding of
            the health of your community‘s members and conversations.
          </Description>
          <ActionRow>
            <Button loading={isLoading} onClick={action} large>
              Unlock Analytics · $100/mo
            </Button>
            <Link to={'/pricing'}>
              <TextButton large>Learn more</TextButton>
            </Link>
          </ActionRow>
          {this.props.community.hasChargeableSource &&
            this.getDefaultCardInfo()}
        </Content>
      </Container>
    );
  }
}

export default compose(connect(), enableCommunityAnalytics)(AnalyticsUpsell);
