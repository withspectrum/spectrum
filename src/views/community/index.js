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
import generateMetaInfo from 'shared/generate-meta-info';
import AppViewWrapper from '../../components/appViewWrapper';
import Column from '../../components/column';
import ThreadFeed from '../../components/threadFeed';
import ListCard from './components/listCard';
import { toggleCommunityMembershipMutation } from '../../api/community';
import { addToastWithTimeout } from '../../actions/toasts';
import { CoverPhoto } from '../../components/profile/coverPhoto';
import Titlebar from '../titlebar';
import { CommunityProfile } from '../../components/profile';
import {
  LoadingProfile,
  LoadingList,
  LoadingComposer,
  LoadingFeed,
} from '../../components/loading';
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
    return this.props.history.push('/new/community');
  };

  render() {
    const {
      match,
      data: { community, user, networkStatus },
      currentUser,
    } = this.props;
    const { isLoading } = this.state;
    const communitySlug = match.params.communitySlug;
    const isMobile = window.innerWidth < 768;
    const dataExists =
      community && !community.deleted && community.communityPermissions;
    const hasRights =
      dataExists &&
      (community.communityPermissions.isMember ||
        community.communityPermissions.isOwner);
    const loggedInUser = user || currentUser;

    if (networkStatus === 7) {
      if (dataExists) {
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
                {loggedInUser &&
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
                    currentUser={loggedInUser}
                  />
                </Column>

                <Column type="primary">

                  {loggedInUser
                    ? hasRights
                        ? <ThreadComposer activeCommunity={communitySlug} />
                        : <UpsellJoinCommunity
                            community={community}
                            loading={isLoading}
                            join={this.toggleMembership}
                          />
                    : <UpsellSignIn entity={community} />}
                  <CommunityThreadFeed
                    viewContext="community"
                    slug={communitySlug}
                    currentUser={loggedInUser}
                  />
                </Column>
              </CoverRow>
            </CoverColumn>
          </AppViewWrapper>
        );
      } else {
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
    } else if (networkStatus === 8) {
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
    } else {
      return (
        <AppViewWrapper>
          <Titlebar noComposer />
          {!isMobile &&
            <Column type="secondary">
              <LoadingProfile />
              <LoadingList />
            </Column>}
          <Column type="primary">
            {!isMobile && <LoadingComposer />}
            <LoadingFeed />
          </Column>
        </AppViewWrapper>
      );
    }
  }
}

export const CommunityView = compose(
  toggleCommunityMembershipMutation,
  getCommunity,
  // displayLoadingScreen,
  pure
)(CommunityViewPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(CommunityView);
