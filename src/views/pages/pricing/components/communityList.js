// @flow
import * as React from 'react';
import type { GetCommunityType } from 'shared/graphql/queries/getCommunity';
import {
  CommunityListGrid,
  CommunityCard,
  CommunityCardAvatar,
  CommunityCardName,
  CommunityCardButton,
} from '../style';

type Props = {
  communities: Array<GetCommunityType>,
};

class CommunityList extends React.Component<Props> {
  render() {
    const { communities } = this.props;
    if (!communities || communities.length === 0) return null;

    return (
      <CommunityListGrid>
        {communities.map(community => {
          return (
            <CommunityCard key={community.id}>
              <CommunityCardAvatar src={community.profilePhoto} />
              <CommunityCardName>{community.name}</CommunityCardName>
              <CommunityCardButton>Manage</CommunityCardButton>
              <CommunityCardButton>Apply for discount</CommunityCardButton>
            </CommunityCard>
          );
        })}
      </CommunityListGrid>
    );
  }
}

export default CommunityList;
