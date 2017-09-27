import React, { Component } from 'react';
import { CommunityProfile } from '../../../../components/profiles';
import { ListCard, Label, CommunityItem } from './style';

class CommunityList extends Component {
  render() {
    const { data, label } = this.props;

    let sorted = data;

    if (label === 'Popular') {
      sorted = data.slice().sort((a, b) => {
        return b.metaData.members - a.metaData.members;
      });
    }

    return (
      <ListCard>
        <Label>
          {label}
        </Label>
        {sorted.map(community => {
          return (
            <CommunityItem key={community.id}>
              <CommunityProfile community={community} />
            </CommunityItem>
          );
        })}
      </ListCard>
    );
  }
}

export default CommunityList;
