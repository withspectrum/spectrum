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
import getCommunityMemberGrowth from 'shared/graphql/queries/community/getCommunityMemberGrowth';
import type { GetCommunityMemberGrowthType } from 'shared/graphql/queries/community/getCommunityMemberGrowth';
import { parseGrowth } from '../utils';

type Props = {
  isLoading: boolean,
  data: {
    community: GetCommunityMemberGrowthType,
  },
};

class MemberGrowth extends React.Component<Props> {
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
      } = community.memberGrowth;
      return (
        <SectionCard>
          <SectionSubtitle>Your community</SectionSubtitle>
          <SectionTitle>{count.toLocaleString()} members</SectionTitle>
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
  getCommunityMemberGrowth,
  viewNetworkHandler
)(MemberGrowth);
