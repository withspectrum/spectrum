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

const ThreadListItemContainer = styled.span`
  display: block;
  &:hover {
    background-color: ${theme.bg.wash};
  }
`;

type ThreadListItemProps = {
  thread: ThreadInfoType,
};

const ThreadListItem = (props: ThreadListItemProps) => (
  <Link to={getThreadLink(props.thread)}>
    <ThreadListItemContainer>
      {props.thread.content.title}
    </ThreadListItemContainer>
  </Link>
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
            .slice(0, 5);
          if (threads.length === 0) return null;
          return (
            <Container>
              <Title>Trending threads</Title>
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
