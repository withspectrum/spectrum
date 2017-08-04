//$FlowFixMe
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
import Grid from '../../../components/grid';
import { UpsellReload } from '../../../components/upsell';
import { LoadingProfileGrid } from '../../../components/loading';
import { UserProfile } from '../../../components/profile';

const MemberGridPure = props => {
  const { data: { community, networkStatus }, data } = props;

  if (networkStatus === 7) {
    const members = community.memberConnection.edges;

    if (members) {
      return (
        <Grid>
          {console.log('>>', community, networkStatus)}
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
      );
    } else {
      return null;
    }
  } else if (networkStatus === 8) {
    return <UpsellReload />;
  } else {
    return <LoadingProfileGrid />;
  }
};

const MemberGrid = compose(pure)(MemberGridPure);
export default MemberGrid;
