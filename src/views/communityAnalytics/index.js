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
import {
  SectionsContainer,
  SectionCard,
  Column,
} from '../../components/settingsViews/style';
import { track, events, transformations } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary, SettingsFallback } from 'src/components/error';
import AnalyticsUpsell from './components/analyticsUpsell';

type Props = {
  currentUser: Object,
  community: GetCommunitySettingsType,
  communitySlug: string,
  dispatch: Dispatch<Object>,
  match: Object,
};

type State = {
  timeframe: 'weekly' | 'monthly',
};

class CommunityAnalytics extends React.Component<Props, State> {
  componentDidMount() {
    const { community } = this.props;
    if (
      community &&
      (!community.hasFeatures || !community.hasFeatures.analytics)
    ) {
      track(events.COMMUNITY_ANALYTICS_VIEWED_UPSELL, {
        community: transformations.analyticsCommunity(community),
      });
    }

    if (community && community.hasFeatures && community.hasFeatures.analytics) {
      track(events.COMMUNITY_ANALYTICS_VIEWED, {
        community: transformations.analyticsCommunity(community),
      });
    }
  }

  render() {
    const { community } = this.props;

    if (community && community.id) {
      return (
        <SectionsContainer>
          {community.hasFeatures.analytics ? (
            <React.Fragment>
              <Column>
                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <MemberGrowth id={community.id} />
                </ErrorBoundary>

                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <TopMembers id={community.id} />
                </ErrorBoundary>
              </Column>
              <Column>
                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <ConversationGrowth id={community.id} />
                </ErrorBoundary>

                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <TopAndNewThreads id={community.id} />
                </ErrorBoundary>
              </Column>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Column style={{ paddingBottom: 0 }}>
                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <MemberGrowth id={community.id} />
                </ErrorBoundary>
              </Column>
              <Column style={{ paddingBottom: 0 }}>
                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <ConversationGrowth id={community.id} />
                </ErrorBoundary>
              </Column>
              <Column fullWidth style={{ paddingTop: 0 }}>
                <ErrorBoundary fallbackComponent={SettingsFallback}>
                  <SectionCard>
                    <AnalyticsUpsell community={community} />
                  </SectionCard>
                </ErrorBoundary>
              </Column>
            </React.Fragment>
          )}
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
