// @flow
import React from 'react';
import { connect } from 'react-redux';
import { PrimaryButton, OutlineButton } from 'src/components/button';
import { Heading, Description, Card } from './style';
import { CommunityAvatar } from 'src/components/avatar';
import { openModal } from 'src/actions/modals';
import { ViewGrid, CenteredGrid } from 'src/components/layout';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import type { Dispatch } from 'redux';

type Props = {
  community: CommunityInfoType,
  dispatch: Dispatch<Object>,
};

const RedirectView = (props: Props) => {
  const { community, dispatch } = props;

  const leaveCommunity = () =>
    dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: community.id,
        entity: 'team-member-leaving-community',
        message: 'Are you sure you want to leave this community?',
        buttonLabel: 'Leave Community',
      })
    );

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
          {community.communityPermissions &&
            community.communityPermissions.isMember &&
            !community.communityPermissions.isOwner && (
              <React.Fragment>
                <div style={{ padding: '8px' }} />
                <OutlineButton onClick={leaveCommunity}>
                  Leave community on Spectrum
                </OutlineButton>
              </React.Fragment>
            )}
        </Card>
      </CenteredGrid>
    </ViewGrid>
  );
};

export const FullScreenRedirectView = connect()(RedirectView);
