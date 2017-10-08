import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
import { ThreadListItem } from '../listItems';
import { ProfileCard } from './style';

class ThreadWithData extends Component {
  render() {
    const { data: { thread, error } } = this.props;
    if (error || !thread) {
      return null;
    }
    return (
      <ProfileCard>
        <Link
          to={{
            pathname: window.location.pathname,
            search: `?thread=${thread.id}`,
          }}
        >
          <ThreadListItem
            contents={thread}
            withDescription={false}
            meta={`${thread.messageCount} message${thread.messageCount === 1
              ? ''
              : 's'}`}
          />
        </Link>
      </ProfileCard>
    );
  }
}

const Thread = compose(connect())(ThreadWithData);
export default Thread;
