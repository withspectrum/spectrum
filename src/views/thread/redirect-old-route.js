// @flow
// Redirect the old thread route (/thread/:threadId) to the new one (/:community/:channel/:threadId)
import React from 'react';
import { Redirect } from 'react-router';
import { getThreadByMatch } from 'shared/graphql/queries/thread/getThread';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import getThreadLink from 'src/helpers/get-thread-link';

export default getThreadByMatch(props => {
  const { data, location } = props;
  if (data) {
    const { thread, loading, error } = data;

    if (thread && thread.id) {
      return (
        <Redirect
          to={{
            ...location,
            pathname: `${getThreadLink(thread)}`,
          }}
        />
      );
    }

    if (loading) {
      return <LoadingView />;
    }

    // If we don't have a thread, but also aren't loading anymore it's either a private or a non-existent thread
    if (error) {
      return <ErrorView />;
    }

    return <ErrorView data-cy="null-thread-view" />;
  }

  return null;
});
