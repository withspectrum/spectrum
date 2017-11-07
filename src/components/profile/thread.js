import React, { Component } from 'react';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThreadListItem } from '../listItems';
import { ProfileCard } from './style';

class ThreadWithData extends Component {
  render() {
    const { data: { thread, error }, setName, location } = this.props;
    if (error || !thread) {
      return null;
    }

    if (setName && thread) {
      this.props.setName(thread.community.name);
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
