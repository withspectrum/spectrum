import * as React from 'react';
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
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const {
        count,
        weeklyGrowth,
        monthlyGrowth,
        quarterlyGrowth,
      } = community.conversationGrowth;
      return (
        <SectionCard>
          <SectionSubtitle>Your community‘s conversations</SectionSubtitle>
          <SectionTitle>
            {count.toLocaleString()} total conversations
          </SectionTitle>
          {parseGrowth(weeklyGrowth, 'this week')}
          {parseGrowth(monthlyGrowth, 'this month')}
          {parseGrowth(quarterlyGrowth, 'this quarter')}
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

export default compose(getCommunityConversationGrowth, viewNetworkHandler)(
  ConversationGrowth
);
