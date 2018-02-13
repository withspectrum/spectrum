// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import getChannelMembersQuery, {
  type GetChannelMembersType,
} from 'shared/graphql/queries/channel/getChannelMemberConnection';
import { FlexCol } from '../../../components/globals';
import { Card } from '../../../components/card';
import { LoadingList } from '../../../components/loading';
import { UserListItem } from '../../../components/listItems';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import { StyledButton } from '../../community/style';

type Props = {
  data: {
    channel: GetChannelMembersType,
    fetchMore: Function,
  },
  isLoading: boolean,
  isFetchingMore: boolean,
};

class ChannelMemberGrid extends React.Component<Props> {
  render() {
    const {
      data: { channel, fetchMore },
      data,
      isLoading,
      isFetchingMore,
    } = this.props;

    if (data && data.channel) {
      const members =
        channel.memberConnection &&
        channel.memberConnection.edges.map(member => member && member.node);
      const totalCount =
        channel.metaData && channel.metaData.members.toLocaleString();

      return (
        <FlexCol
          style={{ padding: '0 16px', flex: 'none', backgroundColor: '#fff' }}
        >
          {members &&
            members.map(user => {
              if (!user) return null;
              return <UserListItem key={user.id} user={user} />;
            })}

          {channel.memberConnection.pageInfo.hasNextPage && (
            <StyledButton loading={isFetchingMore} onClick={() => fetchMore()}>
              View more...
            </StyledButton>
          )}
        </FlexCol>
      );
    }

    if (isLoading) {
      return <LoadingList />;
    }

    return (
      <Card>
        <ViewError
          refresh
          heading={'We weren’t able to fetch the members of this channel.'}
        />
      </Card>
    );
  }
}

export default compose(getChannelMembersQuery, viewNetworkHandler)(
  ChannelMemberGrid
);
