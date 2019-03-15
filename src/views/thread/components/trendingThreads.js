// @flow
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { getCommunityThreadConnectionQuery } from 'shared/graphql/queries/community/getCommunityThreadConnection';
import { Title, Container } from './desktopAppUpsell/style';
import getThreadLink from 'src/helpers/get-thread-link';
import theme from 'shared/theme';
import type { ThreadInfoType } from 'shared/graphql/fragments/thread/threadInfo';

const ThreadListItemContainer = styled(Link)`
  display: block;
  padding: 4px 8px;
  margin-left: -8px;
  width: calc(100% + 16px) !important;

  &:hover {
    background-color: ${theme.bg.wash};
  }

  &:first-of-type {
    margin-top: 8px;
  }
`;

type ThreadListItemProps = {
  thread: ThreadInfoType,
};

const ThreadListItem = (props: ThreadListItemProps) => (
  <ThreadListItemContainer to={getThreadLink(props.thread)}>
    {props.thread.content.title}
  </ThreadListItemContainer>
);

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
            <Container>
              <Title>Now trending in {data.community.name}</Title>
              {threads.map(thread => (
                <ThreadListItem thread={thread} key={thread.id} />
              ))}
            </Container>
          );
        }

        return null;
      }}
    </Query>
  );
};

export default TrendingThreads;
