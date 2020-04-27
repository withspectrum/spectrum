// @flow
import React from 'react';
import { PrimaryButton } from 'src/components/button';
import { Heading, Description, Card } from './style';
import { ViewGrid, CenteredGrid } from 'src/components/layout';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';

type Props = {
  community: CommunityInfoType,
};

export const FullScreenRedirectView = (props: Props) => {
  const { community } = props;

  return (
    <ViewGrid>
      <CenteredGrid>
        <Card
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Heading>{community.name} has a new home</Heading>
          <Description>This community is no longer on Spectrum.</Description>
          <div style={{ padding: '16px' }} />
          <PrimaryButton href={community.website}>
            Go to new community page
          </PrimaryButton>
        </Card>
      </CenteredGrid>
    </ViewGrid>
  );
};
