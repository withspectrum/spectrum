// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { getThisCommunity } from './queries';
import { openModal } from '../../actions/modals';
import { Loading } from '../../components/loading';
import AppViewWrapper from '../../components/appViewWrapper';
import ViewError from '../../components/viewError';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import { Button, OutlineButton, ButtonRow } from '../../components/buttons';
import Titlebar from '../titlebar';
import Header from './components/header';
import MemberGrowth from './components/memberGrowth';
import ConversationGrowth from './components/conversationGrowth';
import TopMembers from './components/topMembers';
import TopAndNewThreads from './components/topAndNewThreads';
import { View, SectionsContainer, Column } from './style';

type Props = {
  match: {
    params: {
      communitySlug: string,
    },
  },
  data: {
    community: {
      name: string,
      profilePhoto: string,
      slug: string,
      isPro: boolean,
    },
  },
  isLoading: boolean,
  hasError: boolean,
  dispatch: Function,
};

type State = {
  timeframe: 'weekly' | 'monthly',
};

class CommunitySettings extends React.Component<Props, State> {
  upgrade = () => {
    const { dispatch, currentUser, data: { community } } = this.props;
    dispatch(
      openModal('COMMUNITY_UPGRADE_MODAL', { user: currentUser, community })
    );
  };

  render() {
    const {
      match: { params: { communitySlug } },
      data: { community },
      isLoading,
      hasError,
    } = this.props;

    if (community) {
      if (!community.isPro) {
        return (
          <AppViewWrapper>
            <Titlebar
              title={`Community analytics`}
              provideBack={true}
              backRoute={`/${communitySlug}`}
              noComposer
            />

            <ViewError
              heading={`Community analytics are available on the Standard plan.`}
              subheading={`To explore analytics for your community, unlock private channels, add multiple moderators, and more, please upgrade to the standard plan.`}
            >
              <ButtonRow>
                <Button onClick={this.upgrade} large>
                  Upgrade to Standard
                </Button>
              </ButtonRow>
            </ViewError>
          </AppViewWrapper>
        );
      }

      return (
        <AppViewWrapper>
          <Titlebar
            title={`${community.name} analytics`}
            provideBack={true}
            backRoute={`/${communitySlug}`}
            noComposer
          />

          <View>
            <Header community={community} />

            <SectionsContainer>
              <Column>
                <MemberGrowth communitySlug={communitySlug} />
                <TopMembers communitySlug={communitySlug} />
              </Column>
              <Column>
                <ConversationGrowth communitySlug={communitySlug} />
                <TopAndNewThreads communitySlug={communitySlug} />
              </Column>
            </SectionsContainer>
          </View>
        </AppViewWrapper>
      );
    }

    if (isLoading) {
      return <Loading />;
    }

    return (
      <AppViewWrapper>
        <Titlebar
          title={`Community analytics`}
          provideBack={true}
          backRoute={`/${communitySlug}`}
          noComposer
        />

        <ViewError
          heading={`You don’t have permission to manage this community.`}
          subheading={`If you want to create your own community, you can get started below.`}
        >
          <ButtonRow>
            <Link to={`/`}>
              <OutlineButton large>Take me back</OutlineButton>
            </Link>

            <Link to={`/new/community`}>
              <Button large>Create a community</Button>
            </Link>
          </ButtonRow>
        </ViewError>
      </AppViewWrapper>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });
export default compose(
  connect(map),
  getThisCommunity,
  viewNetworkHandler,
  pure
)(CommunitySettings);
