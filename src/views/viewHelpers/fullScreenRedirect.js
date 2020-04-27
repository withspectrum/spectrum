// @flow
import React from 'react';
import { PrimaryButton } from 'src/components/button';
import { Heading, Description, Card } from './style';
import { CommunityAvatar } from 'src/components/avatar';
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
            textAlign: 'center',
            padding: '48px 24px',
          }}
        >
          <CommunityAvatar
            community={community}
            size={64}
            showHoverProfile={false}
            isClickable={false}
            style={{ marginBottom: '32px' }}
          />
          <Heading>{community.name} has a new home</Heading>
          <Description style={{ padding: 0, marginTop: 0 }}>
            This community is no longer on Spectrum.
          </Description>
          <div style={{ padding: '16px' }} />
          {community.website && (
            <PrimaryButton href={community.website}>
              Visit new community
            </PrimaryButton>
          )}
        </Card>
      </CenteredGrid>
    </ViewGrid>
  );
};
