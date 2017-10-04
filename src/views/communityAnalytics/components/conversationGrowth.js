import * as React from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import {
  SectionCard,
  SectionSubtitle,
  SectionTitle,
} from '../../communitySettings/style';
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
          {parseGrowth(weeklyGrowth, '7 days')}
          {parseGrowth(monthlyGrowth, '30 days')}
          {parseGrowth(quarterlyGrowth, '90 days')}
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
