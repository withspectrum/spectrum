// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import {
  getCommunitiesByCuratedContentType,
  type GetCommunitiesType,
} from 'shared/graphql/queries/community/getCommunities';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { TableCardButton, SampleCommunitiesWrapper } from '../style';
import Link from 'src/components/link';
import { Loading } from 'src/components/loading';

type Props = {
  data: {
    communities: GetCommunitiesType,
  },
  isLoading: boolean,
};

class SampleCommunities extends React.Component<Props> {
  render() {
    const { data, isLoading } = this.props;
    const hasCommunities = data.communities && data.communities.length > 0;
    const communities = hasCommunities ? data.communities : null;

    if (hasCommunities) {
      return (
        <SampleCommunitiesWrapper>
          {communities &&
            communities.map(community => {
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

    if (isLoading)
      return (
        <div style={{ padding: '32px 16px' }}>
          <Loading />
        </div>
      );

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
