// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import type { CommunityActionsRowType } from '../types';
import Icon from 'src/components/icons';
import { Button, SmallPrimaryButton } from './Button';
import { openComposer } from 'src/actions/composer';
import { openModal } from 'src/actions/modals';
import Composer from 'src/components/composer';
import { MobileActionsRowContainer } from '../style';

export const Component = (props: CommunityActionsRowType) => {
  const { community, dispatch } = props;
  const open = () => dispatch(openComposer());
  const leaveCommunity = () =>
    dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: community.id,
        entity: 'team-member-leaving-community',
        message: 'Are you sure you want to leave this community?',
        buttonLabel: 'Leave Community',
      })
    );

  const { isMember } = community.communityPermissions;

  if (isMember) {
    return (
      <MobileActionsRowContainer>
        <Button>
          <Icon onClick={leaveCommunity} glyph={'settings'} size={28} />
        </Button>

        <Button>
          <Icon onClick={open} glyph={'post'} size={28} />
        </Button>

        <Composer isSlider={true} activeCommunity={community.slug} />
      </MobileActionsRowContainer>
    );
  }

  return (
    <MobileActionsRowContainer>
      <SmallPrimaryButton>Join</SmallPrimaryButton>
    </MobileActionsRowContainer>
  );
};

export const MobileCommunityActionsRow = connect()(Component);
