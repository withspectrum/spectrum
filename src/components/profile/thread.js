// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { ThreadListItem } from '../listItems';
import { ThreadProfileCard } from './style';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';

type Props = {
  data: {
    thread: GetThreadType,
    error: ?string,
  },
  setName: Function,
  markAsDeleted: Function,
  id: string,
};

class ThreadWithData extends React.Component<Props> {
  componentWillMount() {
    const { data: { thread }, data, setName, markAsDeleted, id } = this.props;

    if (setName && thread) {
      setName(thread.community.name);
    }

    // if the query finished loading but no thread was returned,
    // clear this notification out
    if (data.networkStatus === 7 && !data.thread && markAsDeleted) {
      markAsDeleted(id);
    }
  }
  render() {
    const { data: { thread, error } } = this.props;
    if (error || !thread) {
      return null;
    }

    return (
      <ThreadProfileCard>
        <Link
          to={{
            search: `?thread=${thread.id}`,
          }}
        >
          <ThreadListItem
            contents={thread}
            withDescription={false}
            meta={`${thread.messageCount} message${
              thread.messageCount === 1 ? '' : 's'
            }`}
          />
        </Link>
      </ThreadProfileCard>
    );
  }
}

export default compose(connect(), withRouter)(ThreadWithData);
