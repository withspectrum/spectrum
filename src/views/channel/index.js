// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import querystring from 'query-string';
import { withRouter, type History, type Location } from 'react-router-dom';
import generateMetaInfo from 'shared/generate-meta-info';
import Head from 'src/components/head';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import PendingUsersNotification from './components/pendingUsersNotification';
import { getChannelByMatch } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import Search from './components/search';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { SegmentedControl, Segment } from 'src/components/segmentedControl';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import { ChannelProfileCard } from 'src/components/entities';
import { setTitlebarProps } from 'src/actions/titlebar';
import { MobileChannelAction } from 'src/components/titlebar/actions';
import { CommunityAvatar } from 'src/components/avatar';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';
import MembersList from './components/MembersList';
import PostFeed from './components/PostsFeed';
import {
  ViewGrid,
  SecondaryPrimaryColumnGrid,
  PrimaryColumn,
  SecondaryColumn,
} from 'src/components/layout';
import { SidebarSection } from 'src/views/community/style';
import CommunitySidebar from 'src/components/communitySidebar';
import { FeedsContainer } from './style';
import { InfoContainer } from '../community/style';
import { FullScreenRedirectView } from 'src/views/viewHelpers/fullScreenRedirect';

type Props = {
  match: {
    params: {
      communitySlug: string,
      channelSlug: string,
    },
  },
  data: {
    channel: GetChannelType,
  },
  currentUser: Object,
  isLoading: boolean,
  hasError: boolean,
  dispatch: Dispatch<Object>,
  history: History,
  location: Location,
};

class ChannelView extends React.Component<Props> {
  constructor(props) {
    super(props);
    const { location, history } = props;
    const { search } = location;
    const { tab } = querystring.parse(search);
    if (!tab)
      history.replace({
        ...location,
        search: querystring.stringify({ tab: 'posts' }),
      });
  }

  componentDidMount() {
    if (this.props.data && this.props.data.channel) {
      const { channel } = this.props.data;

      this.props.dispatch(
        setTitlebarProps({
          title: `# ${channel.name}`,
          titleIcon: (
            <CommunityAvatar
              isClickable={false}
              community={channel.community}
              size={24}
            />
          ),
          rightAction: <MobileChannelAction channel={channel} />,
        })
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { dispatch } = this.props;
    if (!prevProps.data.channel && this.props.data.channel) {
      const { channel } = this.props.data;
      dispatch(
        setTitlebarProps({
          title: `# ${channel.name}`,
          titleIcon: (
            <CommunityAvatar
              isClickable={false}
              community={channel.community}
              size={24}
            />
          ),
          rightAction: <MobileChannelAction channel={channel} />,
        })
      );
    }

    if (
      this.props.data.channel &&
      prevProps.data.channel &&
      this.props.data.channel.id !== prevProps.data.channel.id
    ) {
      const elem = document.getElementById('main');
      if (elem) elem.scrollTop = 0;
      const { channel } = this.props.data;
      dispatch(
        setTitlebarProps({
          title: `# ${channel.name}`,
          titleIcon: (
            <CommunityAvatar
              isClickable={false}
              community={channel.community}
              size={24}
            />
          ),
          rightAction: <MobileChannelAction channel={channel} />,
        })
      );
      const { location, history } = this.props;
      const { search } = location;
      const { tab } = querystring.parse(search);
      if (!tab)
        history.replace({
          ...location,
          search: querystring.stringify({ tab: 'posts' }),
        });
    }
  }

  handleSegmentClick = (tab: string) => {
    const { history, location } = this.props;
    return history.replace({
      ...location,
      search: querystring.stringify({ tab }),
    });
  };

  render() {
    const {
      data: { channel },
      currentUser,
      isLoading,
      location,
    } = this.props;
    const isLoggedIn = currentUser;
    const { search } = location;
    const { tab } = querystring.parse(search);
    const selectedView = tab;
    if (channel && channel.id) {
      // at this point the view is no longer loading, has not encountered an error, and has returned a channel record
      const { isOwner } = channel.channelPermissions;
      const { community } = channel;
      const isGlobalOwner =
        isOwner || channel.community.communityPermissions.isOwner;

      // at this point the user has full permission to view the channel
      const { title, description } = generateMetaInfo({
        type: 'channel',
        data: {
          name: channel.name,
          communityName: community.name,
          description: channel.description,
        },
      });

      if (community.redirect && community.website) {
        return <FullScreenRedirectView community={community} />;
      }

      return (
        <React.Fragment>
          <Head
            title={title}
            description={description}
            image={community.profilePhoto}
          >
            {community.redirect && community.noindex && (
              <meta name="robots" content="noindex, nofollow" />
            )}
          </Head>

          <ViewGrid>
            <SecondaryPrimaryColumnGrid data-cy="channel-view">
              <SecondaryColumn>
                <CommunitySidebar community={channel.community} />

                {/* user is signed in and has permissions to view pending users */}
                {isLoggedIn && (isOwner || isGlobalOwner) && (
                  <ErrorBoundary>
                    <PendingUsersNotification
                      channel={channel}
                      id={channel.id}
                    />
                  </ErrorBoundary>
                )}
              </SecondaryColumn>

              <PrimaryColumn>
                <FeedsContainer>
                  <SegmentedControl>
                    <Segment
                      onClick={() => this.handleSegmentClick('posts')}
                      isActive={selectedView === 'posts'}
                      data-cy="channel-posts-tab"
                      hideOnDesktop
                    >
                      Posts
                    </Segment>

                    <Segment
                      onClick={() => this.handleSegmentClick('members')}
                      isActive={selectedView === 'members'}
                      hideOnDesktop
                      data-cy="channel-members-tab"
                    >
                      Members
                    </Segment>

                    <Segment
                      onClick={() => this.handleSegmentClick('info')}
                      isActive={selectedView === 'info'}
                      data-cy="channel-info-tab"
                      hideOnDesktop
                    >
                      Info
                    </Segment>
                  </SegmentedControl>

                  {selectedView === 'posts' && <PostFeed channel={channel} />}

                  {selectedView === 'search' && (
                    <ErrorBoundary>
                      <Search channel={channel} />
                    </ErrorBoundary>
                  )}

                  {selectedView === 'members' && (
                    <ErrorBoundary>
                      <MembersList id={channel.id} />
                    </ErrorBoundary>
                  )}

                  {selectedView === 'info' && (
                    <InfoContainer>
                      <SidebarSection>
                        <ChannelProfileCard channel={channel} />
                      </SidebarSection>

                      {/* user is signed in and has permissions to view pending users */}
                      {isLoggedIn && (isOwner || isGlobalOwner) && (
                        <ErrorBoundary>
                          <PendingUsersNotification
                            channel={channel}
                            id={channel.id}
                          />
                        </ErrorBoundary>
                      )}
                    </InfoContainer>
                  )}
                </FeedsContainer>
              </PrimaryColumn>
            </SecondaryPrimaryColumnGrid>
          </ViewGrid>
        </React.Fragment>
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    return <ErrorView data-cy="channel-view-error" />;
  }
}

export default compose(
  withCurrentUser,
  getChannelByMatch,
  viewNetworkHandler,
  withRouter,
  connect()
)(ChannelView);
