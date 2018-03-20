// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { getCommunitiesByCuratedContentType } from 'shared/graphql/queries/community/getCommunities';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { TableCardButton, SampleCommunitiesWrapper } from '../style';
import Link from 'src/components/link';

class SampleCommunities extends React.Component<Props> {
  render() {
    const { data, isLoading } = this.props;
    const hasCommunities = data.communities && data.communities.length > 0;
    const communities = hasCommunities && data.communities;

    if (hasCommunities) {
      return (
        <SampleCommunitiesWrapper>
          {communities.map(community => {
            if (!community) return null;
            return (
              <Link key={community.id} to={`/${community.slug}`}>
                <TableCardButton light>
                  <img
                    alt={`${community.name} community`}
                    src={`${community.profilePhoto}`}
                  />
                  {community.name}
                </TableCardButton>
              </Link>
            );
          })}
        </SampleCommunitiesWrapper>
      );
    }

    if (isLoading) return null;

    return (
      <Link to={'/explore'}>
        <TableCardButton>Explore</TableCardButton>
      </Link>
    );
  }
}

export default compose(getCommunitiesByCuratedContentType, viewNetworkHandler)(
  SampleCommunities
);
