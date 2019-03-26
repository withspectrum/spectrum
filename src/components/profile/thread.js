// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import getThreadLink from 'src/helpers/get-thread-link';
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
  children: any,
};

class ThreadWithData extends React.Component<Props> {
  componentDidMount() {
    const {
      data: { thread },
      data,
      setName,
      markAsDeleted,
      id,
    } = this.props;

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
    const {
      data: { thread, error },
    } = this.props;
    if (error || !thread) {
      return null;
    }

    return (
      <ThreadProfileCard>
        <Link
          to={{
            pathname: getThreadLink(thread),
            state: {
              modal: true,
            },
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

export default compose(
  connect(),
  withRouter
)(ThreadWithData);
