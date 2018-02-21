// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import type { GetCommunitySettingsType } from 'shared/graphql/queries/community/getCommunitySettings';
import ViewError from '../../components/viewError';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import MemberGrowth from './components/memberGrowth';
import ConversationGrowth from './components/conversationGrowth';
import TopMembers from './components/topMembers';
import TopAndNewThreads from './components/topAndNewThreads';
import AnalyticsUpsell from './components/analyticsUpsell';
import {
  SectionsContainer,
  Column,
} from '../../components/settingsViews/style';

type Props = {
  currentUser: Object,
  community: GetCommunitySettingsType,
  communitySlug: string,
  dispatch: Function,
  match: Object,
};

type State = {
  timeframe: 'weekly' | 'monthly',
};

class CommunityAnalytics extends React.Component<Props, State> {
  render() {
    const { community } = this.props;

    if (community && community.id) {
      if (!community.hasFeatures || !community.hasFeatures.analytics) {
        return <AnalyticsUpsell community={community} />;
      }

      return (
        <SectionsContainer>
          <Column>
            <MemberGrowth id={community.id} />
            <TopMembers id={community.id} />
          </Column>
          <Column>
            <ConversationGrowth id={community.id} />
            <TopAndNewThreads id={community.id} />
          </Column>
        </SectionsContainer>
      );
    }

    return (
      <ViewError
        heading={'You don’t have permission to manage this community.'}
        subheading={
          'If you want to create your own community, you can get started below.'
        }
      >
        <ButtonRow>
          <Link to={'/'}>
            <OutlineButton large>Take me back</OutlineButton>
          </Link>

          <Link to={'/new/community'}>
            <Button large>Create a community</Button>
          </Link>
        </ButtonRow>
      </ViewError>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  // $FlowIssue
  connect(map)
)(CommunityAnalytics);
