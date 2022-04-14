// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { Loading } from 'src/components/loading';
import {
  SectionCard,
  SectionSubtitle,
  SectionTitle,
} from 'src/components/settingsViews/style';
import getCommunityConversationGrowth from 'shared/graphql/queries/community/getCommunityConversationGrowth';
import type { GetCommunityConversationGrowthType } from 'shared/graphql/queries/community/getCommunityConversationGrowth';
import { parseGrowth } from '../utils';

type Props = {
  isLoading: boolean,
  data: {
    community: GetCommunityConversationGrowthType,
  },
};

class ConversationGrowth extends React.Component<Props> {
  render() {
    const {
      data: { community },
      isLoading,
    } = this.props;

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

export default compose(
  getCommunityConversationGrowth,
  viewNetworkHandler
)(ConversationGrowth);
