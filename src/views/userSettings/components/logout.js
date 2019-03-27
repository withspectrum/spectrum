// @flow
import React from 'react';
import { SERVER_URL } from 'src/api/constants';
import { OutlineButton } from 'src/components/button';
import { LogoutWrapper } from '../style';
import { SectionCard } from 'src/components/settingsViews/style';

export default () => (
  <LogoutWrapper>
    <SectionCard>
      <OutlineButton href={`${SERVER_URL}/auth/logout`} target="_self">
        Log out
      </OutlineButton>
    </SectionCard>
  </LogoutWrapper>
);
