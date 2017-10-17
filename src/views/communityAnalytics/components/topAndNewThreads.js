import * as React from 'react';
import compose from 'recompose/compose';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { Loading } from '../../../components/loading';
import ViewError from '../../../components/viewError';
import ThreadListItem from './threadListItem';
import { SectionCard, SectionTitle } from '../../communitySettings/style';
import { getCommunityTopAndNewThreads } from '../queries';

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
  isLoading: boolean,
  data: {
    community: {
      topAndNewThreads: {
        topThreads: Array<Thread>,
        newThreads: Array<Thread>,
      },
    },
  },
};

class TopAndNewThreads extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const { topAndNewThreads: { topThreads, newThreads } } = community;
      // resort on the client because while the server *did* technically return the top threads, they get unsorted during the 'getThreads' model query
      const sortedTopThreads = topThreads.slice().sort((a, b) => {
        const bc = parseInt(b.messageCount, 10);
        const ac = parseInt(a.messageCount, 10);
        return bc <= ac ? -1 : 1;
      });

      return (
        <span>
          <SectionCard>
            <SectionTitle>Top conversations this week</SectionTitle>
            {sortedTopThreads.length > 0 ? (
              sortedTopThreads.map(thread => {
                return <ThreadListItem key={thread.id} thread={thread} />;
              })
            ) : (
              <ViewError
                small
                emoji={'😴'}
                heading={`It’s been a bit quiet this week.`}
                subheading={`Top conversations will show up here when people start chatting.`}
              />
            )}
          </SectionCard>
          <SectionCard>
            <SectionTitle>Unanswered conversations this week</SectionTitle>
            {newThreads.length > 0 ? (
              newThreads.map(thread => {
                return <ThreadListItem key={thread.id} thread={thread} />;
              })
            ) : (
              <ViewError
                small
                emoji={'✌️'}
                heading={`All caught up!.`}
                subheading={`It looks like everyone is getting responses in their conversations - nice work!`}
              />
            )}
          </SectionCard>
        </span>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(getCommunityTopAndNewThreads, viewNetworkHandler)(
  TopAndNewThreads
);
