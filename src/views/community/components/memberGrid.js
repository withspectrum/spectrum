//$FlowFixMe
import * as React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import { getCommunityMembersQuery } from '../../../api/community';
import Grid from '../../../components/grid';
import { FlexCol } from '../../../components/globals';
import { Card } from '../../../components/card';
import { LoadingProfileGrid } from '../../../components/loading';
import { UserProfile } from '../../../components/profile';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import { StyledButton } from '../style';

type Props = {
  data: {
    community: {
      memberConnection: Object,
    },
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
      const { edges: members } = community.memberConnection;

      return (
        <FlexCol>
          <Grid>
            {members.map(member => {
              const user = member.node;
              return (
                <UserProfile
                  key={user.id}
                  data={{ user }}
                  username={user.username}
                  profileSize="simple"
                />
              );
            })}
          </Grid>
          {community.memberConnection.pageInfo.hasNextPage && (
            <StyledButton loading={isFetchingMore} onClick={() => fetchMore()}>
              Load more...
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
          heading={`We weren’t able to fetch the members of this community.`}
        />
      </Card>
    );
  }
}

export default compose(getCommunityMembersQuery, viewNetworkHandler, pure)(
  CommunityMemberGrid
);
