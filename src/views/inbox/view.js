import React, { Component } from 'react';
import compose from 'recompose/compose';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import {
  getEverythingThreads,
  getCurrentUserProfile,
} from '../dashboard/queries';
import { FlexRow } from '../../components/globals';
import { Avatar } from '../../components/avatar';
import ThreadContainer from '../thread/containers';
import { List, ThreadListItem, ThreadDetails, Title, Preview } from './style';

const Thread = props => {
  const { thread, location } = props;
  const currentThread = location.search === `?thread=${thread.id}`;

  return (
    <Link to={`?thread=${thread.id}`}>
      <ThreadListItem selected={currentThread}>
        <Avatar src={thread.creator.profilePhoto} size={40} />
        <ThreadDetails>
          <Title>
            {thread.content.title}
          </Title>
          <Preview>
            {thread.content.body.substring(0, 40)}
          </Preview>
        </ThreadDetails>
      </ThreadListItem>
    </Link>
  );
};

const ThreadList = props => {
  const { data: { threads, networkStatus }, currentUser, location } = props;

  if (networkStatus !== 7) {
    return <div />;
  } else {
    return (
      <List>
        {threads.map(threadNode => {
          const thread = threadNode.node;

          return <Thread key={thread.id} thread={thread} location={location} />;
        })}
      </List>
    );
  }
};

export const Master = compose(getEverythingThreads)(ThreadList);

export const Detail = props => {
  const { location } = props;
  // const threadId = queryString.parse(location.search).thread;

  return (
    <div />
    // <ThreadContainer threadId={threadId} slider/>
  );
};
