// @flow
import React from 'react';
import { SERVER_URL } from 'src/api/constants';
import { Button } from 'src/components/buttons';
import { LogoutWrapper } from '../style';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';

export default () => (
  <LogoutWrapper>
    <SectionCard>
      <a href={`${SERVER_URL}/auth/logout`}>
        <Button>Log out</Button>
      </a>
    </SectionCard>
  </LogoutWrapper>
);
