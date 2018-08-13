// @flow
// Redirect the old thread route (/thread/:threadId) to the new one (/:community/:channel/:threadId)
import React from 'react';
import { Redirect } from 'react-router';
import { getThreadByMatch } from 'shared/graphql/queries/thread/getThread';

export default getThreadByMatch(props => {
  if (props.data && props.data.thread) {
    const { thread } = props.data;
    return (
      <Redirect
        to={`/${thread.community.slug}/${thread.channel.slug}/${thread.id}`}
      />
    );
  }
  return null;
});
