// @flow
import * as React from 'react';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import enableCommunityAnalytics from 'shared/graphql/mutations/community/enableCommunityAnalytics';
import { addToastWithTimeout } from 'src/actions/toasts';
import {
  Container,
  Content,
  Subtitle,
  Title,
  Description,
  ActionRow,
} from './style';
import Link from 'src/components/link';
import { Button, TextButton } from 'src/components/buttons';

type Props = {
  community: GetCommunityType,
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

  initAddPaymentMethod = () => {};

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
              Unlock Analytics · $50/mo
            </Button>
            <Link to={'/pricing'}>
              <TextButton large>Learn more</TextButton>
            </Link>
          </ActionRow>
        </Content>
      </Container>
    );
  }
}

export default compose(connect(), enableCommunityAnalytics)(AnalyticsUpsell);
