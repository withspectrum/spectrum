// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { CommunityInfoType } from 'shared/graphql/fragments/community/communityInfo';
import { OutlineButton } from 'src/components/button';
import { ActionsRowContainer } from '../style';

type Props = {
  community: CommunityInfoType,
  dispatch: Dispatch<Object>,
};

export const UnconnectedCommunityActions = (props: Props) => {
  const { community } = props;

  const { isMember, isOwner, isModerator } = community.communityPermissions;
  const isTeamMember = isOwner || isModerator;

  if (isMember) {
    return (
      <ActionsRowContainer>
        {isTeamMember && (
          <OutlineButton to={`/${community.slug}/settings`}>
            Settings
          </OutlineButton>
        )}
      </ActionsRowContainer>
    );
  }

  if (community.redirect) {
    return <div style={{ padding: '8px' }} />;
  }

  return <div style={{ padding: '8px' }} />;
};

export const CommunityActions = connect()(UnconnectedCommunityActions);
