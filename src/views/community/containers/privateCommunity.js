// @flow
import React from 'react';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { OutlineButton, PrimaryButton } from 'src/components/button';
import RequestJoinCommunity from '../components/requestJoinCommunity';
import {
  Emoji,
  Heading,
  Description,
  ActionsRow,
  PrivateCommunityWrapper,
} from '../style';
import { ViewGrid, CenteredGrid } from 'src/components/layout';

type Props = {
  community: GetCommunityType,
};

export const PrivateCommunity = (props: Props) => {
  const { community } = props;
  const { communityPermissions } = community;
  const { isPending } = communityPermissions;

  const heading = isPending
    ? 'Your request to join is pending'
    : 'This community is private';

  const description = isPending
    ? 'Your request to join this community is pending. The owners have been notified, and you will be notified if your request is approved.'
    : 'You can request to join this community below. The owners will be notified of your request, and you will be notified if your request is approved.';

  const primaryAction = ({ isLoading }) =>
    isPending ? (
      <PrimaryButton isLoading={isLoading}>
        {isLoading ? 'Canceling...' : 'Cancel request'}
      </PrimaryButton>
    ) : (
      <PrimaryButton isLoading={isLoading}>
        {isLoading ? 'Requesting...' : 'Request to join'}
      </PrimaryButton>
    );

  return (
    <ViewGrid data-cy="community-view-private">
      <CenteredGrid>
        <PrivateCommunityWrapper>
          <Emoji role="img" aria-label="Private">
            🔑
          </Emoji>
          <Heading>{heading}</Heading>
          <Description>{description}</Description>
          <ActionsRow>
            <RequestJoinCommunity
              isPending={isPending}
              communityId={community.id}
              render={({ isLoading }) => primaryAction({ isLoading })}
            />
          </ActionsRow>
        </PrivateCommunityWrapper>
      </CenteredGrid>
    </ViewGrid>
  );
};
