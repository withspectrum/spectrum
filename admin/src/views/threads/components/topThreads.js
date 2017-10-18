import * as React from 'react';
import ThreadListItem from './threadListItem';
import { SectionCard, SectionTitle, Filter, FilterOption } from '../style';

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
type State = {
  sortedBy: 'messageCount' | 'communityId',
};
class TopThreads extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      sortedBy: 'messageCount',
    };
  }

  sort = (sortedBy: string) => {
    return this.setState({
      sortedBy,
    });
  };

  render() {
    const { threads } = this.props;
    const { sortedBy } = this.state;

    let sortedThreads;
    if (sortedBy === 'messageCount') {
      sortedThreads = threads
        .slice()
        .filter(t => !t.channel.isPrivate)
        .sort((a, b) => {
          const bc = parseInt(b.messageCount, 10);
          const ac = parseInt(a.messageCount, 10);
          return bc <= ac ? -1 : 1;
        });
    }

    if (sortedBy === 'communityId') {
      sortedThreads = threads
        .slice()
        .filter(t => !t.channel.isPrivate)
        .sort((a, b) => {
          const bc = b.community.id;
          const ac = b.community.id;
          return bc <= ac ? -1 : 1;
        });
    }

    return (
      <SectionCard>
        <SectionTitle>Top conversations this week</SectionTitle>

        <Filter>
          <FilterOption
            active={sortedBy === 'messageCount'}
            onClick={() => this.sort('messageCount')}
          >
            Message count
          </FilterOption>
          <FilterOption
            active={sortedBy === 'communityId'}
            onClick={() => this.sort('communityId')}
          >
            Community
          </FilterOption>
        </Filter>

        {sortedThreads.map(thread => {
          return <ThreadListItem key={thread.id} thread={thread} />;
        })}
      </SectionCard>
    );
  }
}

export default TopThreads;
