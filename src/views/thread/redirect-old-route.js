// @flow
// Redirect the old thread route (/thread/:threadId) to the new one (/:community/:channel/:threadId)
import React from 'react';
import { Redirect } from 'react-router';
import slugg from 'slugg';
import idx from 'idx';
import { getThreadByMatch } from 'shared/graphql/queries/thread/getThread';
import { FullscreenThreadView } from 'src/views/thread';
import LoadingThread from 'src/views/thread/components/loading';

export default getThreadByMatch(props => {
  if (props.data && props.data.thread && props.data.thread.id) {
    const { thread } = props.data;
    return (
      <Redirect
        to={`/${thread.community.slug}/${thread.channel.slug}/${slugg(
          thread.content.title
        )}~${thread.id}${idx(props, _ => _.location.search) || ''}`}
      />
    );
  }

  if (props.loading) {
    return <LoadingThread threadViewContext="fullscreen" />;
  }

  // If we don't have a thread, but also aren't loading anymore it's either a private or a non-existant thread
  // In that case, or if it's an error, render the thread container empty state
  if (!props.loading || props.error) {
    return (
      <FullscreenThreadView threadId={props.data.variables.id} slider={false} />
    );
  }

  return null;
});
