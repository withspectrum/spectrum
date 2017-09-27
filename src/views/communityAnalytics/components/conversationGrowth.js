// @flow
import * as React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import { SectionCard, SectionSubtitle, SectionTitle } from '../style';
import { getCommunityConversationGrowth } from '../queries';
import { parseGrowth } from '../utils';

type GrowthType = {
  growth: number,
  currentPeriodCount: number,
  prevPeriodCount: number,
};

type Props = {
  isLoading: boolean,
  data: {
    community: {
      conversationGrowth: {
        count: number,
        weeklyGrowth: GrowthType,
        monthlyGrowth: GrowthType,
        quarterlyGrowth: GrowthType,
      },
    },
  },
};

class ConversationGrowth extends React.Component<Props> {
  render() {
    const { data, data: { community }, isLoading } = this.props;

    if (community) {
      const {
        count,
        weeklyGrowth,
        monthlyGrowth,
        quarterlyGrowth,
      } = community.conversationGrowth;
      return (
        <SectionCard>
          <SectionSubtitle>Conversations</SectionSubtitle>
          <SectionTitle>{count}</SectionTitle>
          {parseGrowth(weeklyGrowth, 'weekly')}
          {parseGrowth(monthlyGrowth, 'monthly')}
          {parseGrowth(quarterlyGrowth, 'quarterly')}
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(
  getCommunityConversationGrowth,
  viewNetworkHandler,
  pure
)(ConversationGrowth);
