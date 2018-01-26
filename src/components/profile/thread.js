// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { ThreadListItem } from '../listItems';
import { ProfileCard } from './style';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';

type Props = {
  data: {
    thread: GetThreadType,
    error: ?string,
  },
  setName: Function,
};

class ThreadWithData extends React.Component<Props> {
  componentWillMount() {
    const { data: { thread }, setName } = this.props;
    if (setName && thread) {
      this.props.setName(thread.community.name);
    }
  }
  render() {
    const { data: { thread, error } } = this.props;
    if (error || !thread) {
      return null;
    }

    return (
      <ProfileCard>
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
      </ProfileCard>
    );
  }
}

export default compose(connect(), withRouter)(ThreadWithData);
