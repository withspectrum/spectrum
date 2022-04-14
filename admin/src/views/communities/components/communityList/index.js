import React, { Component } from 'react';
import {
  CommunityProfile,
  MiniUserProfile,
} from '../../../../components/profiles';
import { ListCard, Label, CommunityItem } from './style';

class CommunityList extends Component {
  render() {
    const { data, label } = this.props;

    const sorted = data.map(community => {
      return {
        ...community,
        creator: {
          ...community.memberConnection.edges[0].node,
        },
      };
    });

    return (
      <ListCard>
        <Label>{label}</Label>
        {sorted.map(community => {
          return (
            <CommunityItem key={community.id}>
              <CommunityProfile community={community} />
              <MiniUserProfile user={community.creator} />
            </CommunityItem>
          );
        })}
      </ListCard>
    );
  }
}

export default CommunityList;
