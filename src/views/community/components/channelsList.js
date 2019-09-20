// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Link, withRouter, type Location } from 'react-router-dom';
import compose from 'recompose/compose';
import type { Dispatch } from 'redux';
import { Query, Mutation } from 'react-apollo';
import { ErrorBoundary } from 'src/components/error';
import Icon from 'src/components/icon';
import { Loading } from 'src/components/loading';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import { withCurrentUser } from 'src/components/withCurrentUser';
import Tooltip from 'src/components/tooltip';
import { ChannelListItem } from 'src/components/entities';
import { WhiteIconButton, OutlineButton } from 'src/components/button';
import { Spinner } from 'src/components/globals';
import { SidebarSectionHeader, SidebarSectionHeading, List } from '../style';
import { getThreadByIdQuery } from 'shared/graphql/queries/thread/getThread';
import { toggleThreadNotificationsMutation } from 'shared/graphql/mutations/thread/toggleThreadNotifications';
import {
  Row,
  Content,
  Label,
  Actions,
} from 'src/components/entities/listItems/style';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  currentUser: Object,
  communitySlug: string,
  location: Location,
};

const ChatTab = ({ location, community, currentUser }) =>
  !community.watercoolerId ? null : (
    <Route exact path={`/${community.slug}`}>
      {({ match }) => {
        const isActive = !!match && location.search.indexOf('tab=chat') > -1;
        return (
          <Link to={`/${community.slug}?tab=chat`}>
            <Row isActive={isActive}>
              <Content>
                <Label>Chat</Label>
              </Content>
              <Actions>
                {!currentUser ? (
                  <Icon glyph="view-forward" size={24} />
                ) : (
                  <Query
                    query={getThreadByIdQuery}
                    variables={{ id: community.watercoolerId }}
                  >
                    {({ loading, error, data }) => {
                      if (data && data.thread) {
                        const showNotificationAction = !!data.thread.community
                          .communityPermissions.isMember;

                        if (!showNotificationAction)
                          return <Icon glyph="view-forward" size={24} />;

                        const tipText = data.thread.receiveNotifications
                          ? 'Mute chat notifications'
                          : 'Enable chat notifications';
                        const glyph = data.thread.receiveNotifications
                          ? 'notification'
                          : 'mute';

                        return (
                          <Mutation
                            mutation={toggleThreadNotificationsMutation}
                          >
                            {(toggleThreadNotifications, { loading }) => (
                              <Tooltip content={tipText}>
                                <span
                                  style={{ marginLeft: '8px', display: 'flex' }}
                                >
                                  {/* {!newActivity && !isActive && <NewActivityDot />} */}
                                  <OutlineButton
                                    disabled={loading}
                                    onClick={(e: any) => {
                                      e &&
                                        e.preventDefault() &&
                                        e.stopPropogation();
                                      toggleThreadNotifications({
                                        variables: {
                                          threadId: data.thread.id,
                                        },
                                      });
                                    }}
                                    style={{ padding: '4px' }}
                                    size={'small'}
                                  >
                                    <Icon
                                      style={{
                                        marginTop: '-1px',
                                      }}
                                      glyph={glyph}
                                      size={24}
                                    />
                                  </OutlineButton>
                                </span>
                              </Tooltip>
                            )}
                          </Mutation>
                        );
                      }

                      if (loading) return <Spinner color="text.alt" />;

                      if (error) return <Icon glyph="view-forward" size={24} />;

                      return null;
                    }}
                  </Query>
                )}
              </Actions>
            </Row>
          </Link>
        );
      }}
    </Route>
  );

class Component extends React.Component<Props> {
  sortChannels = (array: Array<any>): Array<?any> => {
    if (!array || array.length === 0) return [];

    const generalChannel = array.find(channel => channel.slug === 'general');
    const withoutGeneral = array.filter(channel => channel.slug !== 'general');
    const sortedWithoutGeneral = withoutGeneral.sort((a, b) => {
      if (a.slug < b.slug) return -1;
      if (a.slug > b.slug) return 1;
      return 0;
    });
    if (generalChannel) {
      sortedWithoutGeneral.unshift(generalChannel);
      return sortedWithoutGeneral;
    } else {
      return sortedWithoutGeneral;
    }
  };

  render() {
    const {
      isLoading,
      currentUser,
      data: { community },
      location,
    } = this.props;

    if (isLoading) {
      return (
        <React.Fragment>
          <SidebarSectionHeader>
            <SidebarSectionHeading>Channels</SidebarSectionHeading>
          </SidebarSectionHeader>
          <Loading style={{ padding: '32px' }} />
        </React.Fragment>
      );
    }

    if (community && community.channelConnection) {
      const { isOwner } = community.communityPermissions;
      const channels = community.channelConnection.edges
        .map(channel => channel && channel.node)
        .filter(channel => {
          if (!channel) return null;
          if (channel.isArchived) return null;
          if (channel.isPrivate && !channel.channelPermissions.isMember)
            return null;

          return channel;
        })
        .filter(channel => channel && !channel.channelPermissions.isBlocked);

      const sortedChannels = this.sortChannels(channels);

      return (
        <React.Fragment>
          <SidebarSectionHeader>
            <SidebarSectionHeading>Channels</SidebarSectionHeading>
            {isOwner && (
              <Tooltip content={'Manage channels'}>
                <span>
                  <WhiteIconButton to={`/${community.slug}/settings`}>
                    <Icon glyph={'settings'} size={24} />
                  </WhiteIconButton>
                </span>
              </Tooltip>
            )}
          </SidebarSectionHeader>

          <List data-cy="channel-list">
            <ChatTab
              location={location}
              community={community}
              currentUser={currentUser}
            />
            <Route exact path={`/${community.slug}`}>
              {({ match }) => (
                <Link to={`/${community.slug}?tab=posts`}>
                  <Row
                    isActive={
                      !!match && location.search.indexOf('tab=posts') > -1
                    }
                  >
                    <Content>
                      <Label>
                        # All{' '}
                        {currentUser && community.communityPermissions.isMember
                          ? 'your '
                          : ' '}
                        channels
                      </Label>
                    </Content>
                    <Actions>
                      <Icon glyph="view-forward" size={24} />
                    </Actions>
                  </Row>
                </Link>
              )}
            </Route>
            {sortedChannels.map(channel => {
              if (!channel) return null;
              return (
                <ErrorBoundary key={channel.id}>
                  <Route path={`/${channel.community.slug}/${channel.slug}`}>
                    {({ match }) => (
                      <ChannelListItem
                        channel={channel}
                        name={channel.name}
                        isActive={!!match}
                      />
                    )}
                  </Route>
                </ErrorBoundary>
              );
            })}
          </List>
        </React.Fragment>
      );
    }

    return null;
  }
}

export const ChannelsList = compose(
  getCommunityChannels,
  viewNetworkHandler,
  withCurrentUser,
  withRouter,
  connect()
)(Component);
