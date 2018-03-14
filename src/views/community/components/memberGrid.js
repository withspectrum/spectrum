// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';
import { FlexCol } from 'src/components/globals';
import { Card } from 'src/components/card';
import { LoadingList } from 'src/components/loading';
import { UserListItem } from 'src/components/listItems';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';

type Props = {
  data: {
    community: GetCommunityMembersType,
    fetchMore: Function,
  },
  isLoading: boolean,
  isFetchingMore: boolean,
};

class CommunityMemberGrid extends React.Component<Props> {
  render() {
    const { data: { community }, isLoading } = this.props;

    if (community) {
      const { edges: members } = community.members;
      const nodes = members.map(member => member && member.node);

      return (
        <FlexCol
          style={{ padding: '0 16px', flex: 'none', backgroundColor: '#fff' }}
        >
          {nodes.map(node => {
            if (!node) return null;
            let { user, ...rest } = node;
            user = Object.assign({}, user, {
              ...rest,
            });
            return <UserListItem key={user.id} user={user} />;
          })}
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
          heading={'We weren’t able to fetch the members of this community.'}
        />
      </Card>
    );
  }
}

export default compose(getCommunityMembersQuery, viewNetworkHandler)(
  CommunityMemberGrid
);
