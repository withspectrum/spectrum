// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import getCommunityMembersQuery from 'shared/graphql/queries/community/getCommunityMemberConnection';
import type { GetCommunityMemberConnectionType } from 'shared/graphql/queries/community/getCommunityMemberConnection';
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
    community: GetCommunityMemberConnectionType,
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
      const nodes = members.map(member => member && member.node);
      return (
        <FlexCol>
          <Grid>
            {nodes.map(node => {
              if (!node) return null;
              const { user } = node;
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
          heading={'We weren’t able to fetch the members of this community.'}
        />
      </Card>
    );
  }
}

export default compose(getCommunityMembersQuery, viewNetworkHandler)(
  CommunityMemberGrid
);
