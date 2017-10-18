import * as React from 'react';
import ThreadListItem from './threadListItem';
import { SectionCard, SectionTitle } from '../style';

type Thread = {
  id: string,
  content: {
    title: string,
  },
  messageCount: number,
  createdAt: string,
  creator: {
    id: string,
    username: string,
    name: string,
    profilePhoto: string,
  },
};

type Props = {
  threads: Array<Thread>,
};

class TopThreads extends React.Component<Props> {
  render() {
    const { threads } = this.props;

    const sortedThreads = threads.slice().sort((a, b) => {
      const bc = parseInt(b.messageCount, 10);
      const ac = parseInt(a.messageCount, 10);
      return bc <= ac ? -1 : 1;
    });

    return (
      <SectionCard>
        <SectionTitle>Top conversations this week</SectionTitle>
        {sortedThreads.map(thread => {
          return <ThreadListItem key={thread.id} thread={thread} />;
        })}
      </SectionCard>
    );
  }
}

export default TopThreads;
