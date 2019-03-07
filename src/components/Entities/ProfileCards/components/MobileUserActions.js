// @flow
import React from 'react';
import Icon from 'src/components/icons';
import { WhiteIconButton } from 'src/views/Community/components/Button';
import { MobileActionsRowContainer } from '../style';

export const MobileUserActions = (props: Props) => {
  const { user } = props;

  return (
    <MobileActionsRowContainer>
      <WhiteIconButton>
        <Icon glyph={'message-simple'} size={32} />
      </WhiteIconButton>
    </MobileActionsRowContainer>
  );
};
