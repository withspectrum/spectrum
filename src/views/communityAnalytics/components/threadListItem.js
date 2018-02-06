// @flow
import * as React from 'react';
import Link from 'src/components/link';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
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
        id,
        author: { user: { name, username } },
        content: { title },
        messageCount,
      },
    } = this.props;

    return (
      <StyledThreadListItem>
        <Link
          to={{
            pathname: window.location.pathname,
            search: `?thread=${id}`,
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
