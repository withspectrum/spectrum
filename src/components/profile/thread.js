import React, { Component } from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { ThreadListItem } from '../listItems';
import { ProfileCard } from './style';

class ThreadWithData extends Component {
  state = {
    communityNameSet: false,
  };

  componentWillReceiveProps(next) {
    if (this.state.communityNameSet || !next.setName) return;

    if (next.data.thread && next.data.thread.community && next.setName) {
      this.setState(
        {
          communityNameSet: true,
        },
        () => {
          next.setName(next.data.thread.community.name);
        }
      );
    }
  }

  render() {
    const { data: { thread, error }, setName } = this.props;
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
            meta={`${thread.messageCount} message${thread.messageCount === 1
              ? ''
              : 's'}`}
          />
        </Link>
      </ProfileCard>
    );
  }
}

export default compose(connect(), withRouter)(ThreadWithData);
