// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { openModal } from '../../actions/modals';
import { track } from '../../helpers/events';
import ThreadComposer from '../../components/threadComposer';
import Head from '../../components/head';
import generateMetaInfo from 'iris/shared/generate-meta-info';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import ListCard from './components/listCard';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from '../../components/profile';
import { displayLoadingScreen } from '../../components/loading';
import {
  UpsellSignIn,
  UpsellJoinCommunity,
  Upsell404Community,
} from '../../components/upsell';
import { CoverRow, CoverColumn, CoverButton } from './style';

import {
  getCommunityThreads,
  getCommunity,
  getCommunityChannels,
} from './queries';

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

const ChannelListCard = compose(getCommunityChannels)(ListCard);

class CommunityViewPure extends Component {
  state: {
    isLoading: boolean,
  };

  constructor() {
    super();

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    track('community', 'viewed', null);
  }

  toggleMembership = communityId => {
    const { toggleCommunityMembership, dispatch } = this.props;

    this.setState({
      isLoading: true,
    });

    toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        this.setState({
          isLoading: false,
        });

        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';
        dispatch(addToastWithTimeout(type, str));
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  create = () => {
    const communitySlug = this.props.match.params.communitySlug;

    return this.props.dispatch(
      openModal('CREATE_COMMUNITY_MODAL', { name: communitySlug })
    );
  };

  render() {
    const { match, data: { community, error }, currentUser } = this.props;
    const { isLoading } = this.state;
    const communitySlug = match.params.communitySlug;

    if (error) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={`Community Not Found`}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="primary">
            <Upsell404Community community={communitySlug} />;
          </Column>
        </AppViewWrapper>
      );
    }

    if (!community || community.deleted) {
      return (
        <AppViewWrapper>
          <Titlebar
            title={'Community Not Found'}
            provideBack={true}
            backRoute={`/`}
            noComposer
          />
          <Column type="primary">
            <Upsell404Community
              community={communitySlug}
              create={this.create}
            />
          </Column>
        </AppViewWrapper>
      );
    }

    const { title, description } = generateMetaInfo({
      type: 'community',
      data: {
        name: community.name,
        description: community.description,
      },
    });

    return (
      <AppViewWrapper>
        <Titlebar
          title={community.name}
          provideBack={true}
          backRoute={`/`}
          noComposer={!community.communityPermissions.isMember}
        />
        <Head title={title} description={description} />
        <CoverColumn>
          <CoverPhoto src={community.coverPhoto}>
            {currentUser &&
              (!community.communityPermissions.isOwner &&
                community.communityPermissions.isMember) &&
              <CoverButton
                glyph="minus-fill"
                color="bg.default"
                hoverColor="bg.default"
                opacity="0.5"
                tipText="Leave community"
                tipLocation="left"
                onClick={() => this.toggleMembership(community.id)}
              />}
          </CoverPhoto>
          <CoverRow className={'flexy'}>
            <Column type="secondary" className={'inset'}>
              <CommunityProfile data={{ community }} profileSize="full" />
              <ChannelListCard
                slug={communitySlug.toLowerCase()}
                currentUser={currentUser}
              />
            </Column>

            <Column type="primary">
              {!currentUser && <UpsellSignIn entity={community} />}
              {currentUser &&
                !community.communityPermissions.isMember &&
                <UpsellJoinCommunity
                  community={community}
                  loading={isLoading}
                  join={this.toggleMembership}
                />}
              {currentUser &&
                (community.communityPermissions.isMember ||
                  community.communityPermissions.isOwner) &&
                <ThreadComposer activeCommunity={communitySlug} />}
              <CommunityThreadFeed
                viewContext="community"
                slug={communitySlug}
                currentUser={currentUser}
              />
            </Column>
          </CoverRow>
        </CoverColumn>
      </AppViewWrapper>
    );
  }
}

export const CommunityView = compose(
  toggleCommunityMembershipMutation,
  getCommunity,
  displayLoadingScreen,
  pure
)(CommunityViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(CommunityView);
