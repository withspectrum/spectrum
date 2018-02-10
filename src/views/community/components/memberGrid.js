// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import getCommunityMembersQuery, {
  type GetCommunityMembersType,
} from 'shared/graphql/queries/community/getCommunityMembers';
import Grid from '../../../components/grid';
import { FlexCol } from '../../../components/globals';
import { Card } from '../../../components/card';
import { LoadingProfileGrid } from '../../../components/loading';
import { UserListItem } from '../../../components/listItems';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import { StyledButton } from '../style';

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
    const {
      data: { community, fetchMore },
      isLoading,
      isFetchingMore,
    } = this.props;

    if (community) {
      const { edges: members } = community.members;
      const nodes = members.map(member => member && member.node);
      return (
        <FlexCol
          style={{ padding: '0 16px', flex: 'none', backgroundColor: '#fff' }}
        >
          {nodes.map(node => {
            if (!node) return null;
            const { user } = node;
            return <UserListItem key={user.id} user={user} />;
          })}
          {community.members.pageInfo.hasNextPage && (
            <StyledButton loading={isFetchingMore} onClick={() => fetchMore()}>
              View more...
            </StyledButton>
          )}
        </FlexCol>
      );
    }

    if (isLoading) {
      return <LoadingProfileGrid />;
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
