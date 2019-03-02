// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import getThreadLink from 'src/helpers/get-thread-link';
import {
  StyledThreadListItem,
  ThreadListItemTitle,
  ThreadListItemSubtitle,
} from '../style';

type Props = {
  thread: GetThreadType,
};

class ThreadListItem extends React.Component<Props> {
  render() {
    const {
      thread: {
        author: {
          user: { name, username },
        },
        content: { title },
        messageCount,
      },
    } = this.props;

    return (
      <StyledThreadListItem>
        <Link
          to={{
            pathname: getThreadLink(this.props.thread),
            state: { modal: true },
          }}
        >
          <ThreadListItemTitle>{title}</ThreadListItemTitle>
        </Link>
        {messageCount > 0 && (
          <ThreadListItemSubtitle>
            {messageCount > 1 ? `${messageCount} messages` : '1 message'}
          </ThreadListItemSubtitle>
        )}
        <ThreadListItemSubtitle>
          By <Link to={`/users/${username}`}>{name}</Link>
        </ThreadListItemSubtitle>
      </StyledThreadListItem>
    );
  }
}

export default ThreadListItem;
