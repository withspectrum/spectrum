//$FlowFixMe
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import styled from 'styled-components';
import Grid from '../../../components/grid';
import { FlexCol } from '../../../components/globals';
import { Button } from '../../../components/buttons';
import { UpsellReload } from '../../../components/upsell';
import { LoadingProfileGrid } from '../../../components/loading';
import { UserProfile } from '../../../components/profile';

const StyledButton = styled(Button)`
  flex: none;

  @media (max-width: 768px) {
    margin: 2px 0;
    padding: 16px 0;
    width: 100%;
    border-radius: 0;
  }
`;

const MemberGridPure = props => {
  const { data: { community, networkStatus, fetchMore }, data } = props;
  const dataExists = community && community.memberConnection;

  if (networkStatus < 7 && !dataExists) {
    return <LoadingProfileGrid />;
  } else if (networkStatus === 8) {
    return <UpsellReload />;
  } else {
    const members = community.memberConnection.edges;
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
        {community.memberConnection.pageInfo.hasNextPage &&
          <StyledButton
            loading={networkStatus === 3}
            onClick={() => fetchMore()}
          >
            Load more...
          </StyledButton>}
      </FlexCol>
    );
  }
};

const MemberGrid = compose(pure)(MemberGridPure);
export default MemberGrid;
