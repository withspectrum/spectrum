// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { getCommunityThreadConnectionQuery } from 'shared/graphql/queries/community/getCommunityThreadConnection';
import { Container } from './desktopAppUpsell/style';
import getThreadLink from 'src/helpers/get-thread-link';
import theme from 'shared/theme';
import truncate from 'shared/truncate';
import { SidebarSectionHeading } from 'src/views/community/style';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';
import { timeDifferenceShort } from 'shared/time-difference';

const ThreadListItemContainer = styled(Link)`
  display: block;
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.bg.divider};

  &:hover {
    background-color: ${theme.bg.wash};
  }

  &:last-of-type {
    border-bottom: 0;
    padding-bottom: 16px;
  }
`;

const ThreadContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ThreadTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

const ThreadMeta = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: ${theme.text.alt};
  line-height: 1.2;
  margin-top: 2px;
`;

type ThreadListItemProps = {
  thread: ThreadInfoType,
};

const ThreadListItem = (props: ThreadListItemProps) => {
  const { thread } = props;
  const { lastActive, createdAt, content } = thread;

  const now = new Date().getTime();
  const then = lastActive || createdAt;
  let timestamp = timeDifferenceShort(now, new Date(then).getTime());

  return (
    <ThreadListItemContainer to={getThreadLink(thread)}>
      <ThreadContent>
        <ThreadTitle>{truncate(content.title, 80)}</ThreadTitle>
        <ThreadMeta>
          @{thread.author.user.username} · {timestamp}
        </ThreadMeta>
      </ThreadContent>
    </ThreadListItemContainer>
  );
};

type Props = {
  id: string,
};

const TrendingThreads = (props: Props) => {
  return (
    <Query
      query={getCommunityThreadConnectionQuery}
      variables={{ id: props.id, sort: 'trending' }}
    >
      {({ data }) => {
        if (data.community) {
          const threads = data.community.threadConnection.edges
            .map(
              ({ node }) => node
              // Only show five other trending threads
            )
            // Don't show watercoolers
            .filter(thread => !thread.watercooler)
            .slice(0, 5);
          if (threads.length === 0) return null;
          return (
            <React.Fragment>
              <Container style={{ paddingBottom: '4px' }}>
                <SidebarSectionHeading>
                  Trending conversations
                </SidebarSectionHeading>
              </Container>
              {threads.map(thread => (
                <ThreadListItem thread={thread} key={thread.id} />
              ))}
            </React.Fragment>
          );
        }

        return null;
      }}
    </Query>
  );
};

export default TrendingThreads;
