// @flow
import React from 'react';
import AppViewWrapper from 'src/components/appViewWrapper';
import { OutlineButton, PrimaryButton } from '../components/Button';
import RequestJoinCommunity from '../components/RequestJoinCommunity';
import {
  CenteredContainer,
  SingleColumnSection,
  Emoji,
  Heading,
  Description,
  ActionsRow,
} from '../style';

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
      <PrimaryButton isLoading={isLoading}>Cancel request</PrimaryButton>
    ) : (
      <PrimaryButton isLoading={isLoading}>Request to join</PrimaryButton>
    );

  return (
    <AppViewWrapper>
      <CenteredContainer>
        <SingleColumnSection>
          <Emoji role="img" aria-label="Private">
            🔑
          </Emoji>
          <Heading>{heading}</Heading>
          <Description>{description}</Description>
          <ActionsRow>
            <OutlineButton to={'/'}>Go home</OutlineButton>

            <RequestJoinCommunity
              isPending={isPending}
              communityId={community.id}
              render={({ isLoading }) => primaryAction({ isLoading })}
            />
          </ActionsRow>
        </SingleColumnSection>
      </CenteredContainer>
    </AppViewWrapper>
  );
};
