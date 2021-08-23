// @flow
import React from 'react';
import compose from 'recompose/compose';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';
import getChannelThreads from 'shared/graphql/queries/channel/getChannelThreadConnection';
import ThreadFeed from 'src/components/threadFeed';
import { withCurrentUser } from 'src/components/withCurrentUser';

const ChannelThreadFeed = compose(getChannelThreads)(ThreadFeed);

type Props = {
  channel: GetChannelType,
  currentUser: ?UserInfoType,
};

export default withCurrentUser((props: Props) => {
  const { channel } = props;

  return (
    <React.Fragment>
      <ChannelThreadFeed
        viewContext="channelProfile"
        slug={channel.slug}
        id={channel.id}
        setThreadsStatus={false}
        isNewAndOwned={false}
        channel={channel}
      />
    </React.Fragment>
  );
});
