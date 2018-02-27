// @flow
import * as React from 'react';
import type { GetCommunityType } from 'shared/graphql/queries/getCommunity';
import Link from 'src/components/link';
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
              <Link to={`/${community.slug}/settings`}>
                <CommunityCardButton>Manage</CommunityCardButton>
              </Link>
              <a
                href={`mailto:hi@spectrum.chat?subject=Discount request for the ${
                  community.name
                } community`}
              >
                <CommunityCardButton>Apply for discount</CommunityCardButton>
              </a>
            </CommunityCard>
          );
        })}
      </CommunityListGrid>
    );
  }
}

export default CommunityList;
